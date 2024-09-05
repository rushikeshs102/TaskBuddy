import React, { useState, useEffect } from "react";
import Cards from "./Cards";
import Inputdata from "./Inputdata";
import axios from "axios";

function Imptask() {
  const [tasks, setTasks] = useState([]);
  const [inputDiv, setInputDiv] = useState("hidden");
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [delBtn, setDelBtn] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8081/tasks", {
        withCredentials: true,
      });
      const importantTasks = response.data.filter(
        (task) => task.IsFavorite === 1
      );
      setTasks(importantTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskDelete = async (taskId) => {
    if (!taskId) {
      console.error("Task ID is missing or undefined");
      return;
    }

    try {
      await axios.delete(`http://localhost:8081/tasks/${taskId}`, {
        withCredentials: true,
      });
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setInputDiv("fixed");
  };

  const handleTaskUpdated = () => {
    fetchTasks();
    setTaskToEdit(null);
  };

  const handleTaskFavoriteChanged = (taskId, newFavoriteStatus) => {
    if (newFavoriteStatus === 0) {
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.TaskID !== taskId)
      );
    }
  };

  return (
    <>
      <div>
        <Cards
          home={"false"}
          tasks={tasks}
          setTasks={setTasks}
          onTaskDelete={handleTaskDelete}
          onEditTask={handleEditTask}
          setInputDiv={setInputDiv}
          onTaskFavoriteChanged={handleTaskFavoriteChanged}
          delBtn={delBtn}
        />
      </div>
      <Inputdata
        InputDiv={inputDiv}
        setInputDiv={setInputDiv}
        taskToEdit={taskToEdit}
        onTaskUpdated={handleTaskUpdated}
      />
    </>
  );
}

export default Imptask;
