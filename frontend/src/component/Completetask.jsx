import React, { useEffect, useState } from "react";
import Cards from "./Cards";
import Inputdata from "./Inputdata";
import axios from "axios";

function Completetask() {
  const [tasks, setTasks] = useState([]);
  const [inputDiv, setInputDiv] = useState("hidden");
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [delBtn, setDelBtn] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8081/tasks", {
        withCredentials: true,
      });
      const completeTasks = response.data.filter((task) => task.Status === 1);
      setTasks(completeTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskDelete = (taskId) => {
    axios
      .delete(`http://localhost:8081/tasks/${taskId}`)
      .then(() => {
        setTasks(tasks.filter((task) => task.TaskID !== taskId));
      })
      .catch((err) => console.error("Error deleting task:", err));
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setInputDiv("fixed");
  };

  const handleTaskUpdated = () => {
    fetchTasks();
    setTaskToEdit(null);
  };

  const handleTaskStatusChanged = (taskId, newStatus) => {
    if (newStatus === 0) {
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
          onTaskStatusChanged={handleTaskStatusChanged}
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

export default Completetask;
