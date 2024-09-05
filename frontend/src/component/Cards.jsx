import React, { useState, useEffect } from "react";
import { CiStar } from "react-icons/ci";
import { FaEdit, FaStar } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import axios from "axios";

function Cards({
  home,
  setInputDiv,
  tasks,
  setTasks,
  onTaskDelete,
  onEditTask,
  onTaskStatusChanged,
  onTaskFavoriteChanged,
  delBtn,
}) {
  const [timers, setTimers] = useState({});
  const [alertedTasks, setAlertedTasks] = useState(new Set());

  const onTaskStatusChange = (task) => {
    const updatedStatus = task.Status === 0 ? 1 : 0;

    axios
      .put(`http://localhost:8081/tasks/${task.TaskID}/status`, {
        status: updatedStatus,
      })
      .then(() => {
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.TaskID === task.TaskID ? { ...t, Status: updatedStatus } : t
          )
        );
        if (onTaskStatusChanged)
          onTaskStatusChanged(task.TaskID, updatedStatus);
      })
      .catch((err) => console.error("Error updating task status:", err));
  };

  const onTaskToggleFavorite = (task) => {
    const updatedFavorite = task.IsFavorite === 0 ? 1 : 0;

    axios
      .put(`http://localhost:8081/tasks/${task.TaskID}/favorite`, {
        isFavorite: updatedFavorite,
      })
      .then(() => {
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.TaskID === task.TaskID ? { ...t, IsFavorite: updatedFavorite } : t
          )
        );
        if (onTaskFavoriteChanged)
          onTaskFavoriteChanged(task.TaskID, updatedFavorite);
      })
      .catch((err) =>
        console.error("Error updating task favorite status:", err)
      );
  };

  const handleDeleteTask = (task) => {
    if (task.Status === 1) {
      const confirmed = window.confirm(
        "Do you really want to delete this task?"
      );
      if (confirmed) {
        onTaskDelete(task.TaskID);
      }
    } else {
      alert("Task cannot be deleted unless it is marked as complete.");
    }
  };

  const calculateTimeLeft = (timestamp) => {
    const now = new Date();
    const targetTime = new Date(timestamp);
    targetTime.setHours(targetTime.getHours() + 3); // Add 3 hours to the favorite timestamp
    const difference = targetTime - now;

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    } else {
      timeLeft = null;
    }

    return timeLeft;
  };

  useEffect(() => {
    const updateTimers = () => {
      setTimers((prevTimers) => {
        const newTimers = { ...prevTimers };

        {tasks.forEach((task) => {
          if (task.IsFavorite === 1 && task.FavoriteTimestamp) {
            const timeLeft = calculateTimeLeft(task.FavoriteTimestamp);
            newTimers[task.TaskID] = timeLeft;

            if (timeLeft) {
              const totalMinutesLeft = timeLeft.hours * 60 + timeLeft.minutes;
              if (totalMinutesLeft <= 0) {
                if (!alertedTasks.has(task.TaskID)) {
                  alert(`The timer for task "${task.Title}" has ended.`);
                  setAlertedTasks(
                    (prevAlerted) => new Set([...prevAlerted, task.TaskID])
                  );
                }
              } else if (
                totalMinutesLeft <= 10 &&
                !alertedTasks.has(task.TaskID)
              ) {
                alert(
                  `Task "${task.Title}" has ${timeLeft.minutes} minutes left.`
                );
                setAlertedTasks(
                  (prevAlerted) => new Set([...prevAlerted, task.TaskID])
                );
              }
            }
          }
        });}

        return newTimers;
      });
    };

    updateTimers();

    const intervalId = setInterval(updateTimers, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [tasks, alertedTasks]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.isArray(tasks) &&
        tasks.map((item) => {
          let timeLeft = null;
          if (item.IsFavorite === 1 && item.FavoriteTimestamp) {
            timeLeft = calculateTimeLeft(item.FavoriteTimestamp);
          }

          return (
            <div
              key={item.TaskID}
              className="border border-gray-600 bg-gray-500 p-2 rounded-xl flex flex-col justify-between"
            >
              <div className="flex flex-col gap-3 my-2">
                <p className="text-xl md:text-2xl text-gray-800 font-medium">
                  {item.Title}
                </p>
                {timeLeft && (
                  <p className="text-red-800 font-bold">
                    {`Time left: ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
                  </p>
                )}
                <p className="break-words whitespace-normal text-sm md:text-base">
                  {item.Description}
                </p>
              </div>
              <div className="flex flex-row gap-3 justify-center items-center">
                <button
                  className={`${
                    item.Status === 0
                      ? "bg-red-500 hover:bg-red-700"
                      : "bg-green-500 hover:bg-green-700"
                  } p-2 rounded-lg w-3/6 text-white font-bold`}
                  onClick={() => onTaskStatusChange(item)}
                >
                  {item.Status === 0 ? "Incomplete" : "Complete"}
                </button>
                <div className="flex flex-row gap-3 justify-around text-2xl p-2 w-3/6">
                  <button onClick={() => onTaskToggleFavorite(item)}>
                    {item.IsFavorite === 0 ? (
                      <CiStar />
                    ) : (
                      <FaStar className="text-yellow-500" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setInputDiv("fixed");
                      onEditTask(item);
                    }}
                  >
                    <FaEdit />
                  </button>

                  {delBtn && (
                    <button onClick={() => handleDeleteTask(item)}>
                      <MdDelete />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      {home === "true" && (
        <button
          onClick={() => setInputDiv("fixed")}
          className="border border-gray-600 bg-gray-500 text-gray-300 p-2 rounded-xl flex flex-col gap-3 justify-center items-center hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          <IoMdAddCircle className="text-5xl" />
          <h2 className="text-3xl">Add Task</h2>
        </button>
      )}
    </div>
  );
}

export default Cards;
