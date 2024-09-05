import React, { useState, useEffect } from "react";
import Cards from "./Cards";
import Inputdata from "./Inputdata";
import axios from "axios";

function Alltask() {
  const [inputDiv, setInputDiv] = useState("hidden");
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [delBtn, setDelBtn] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8081/tasks", {
        withCredentials: true,
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskAdded = () => {
    fetchTasks();
  };

  const handleTaskDelete = async (taskId) => {
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
  };

  const handleTaskUpdated = () => {
    fetchTasks();
    setTaskToEdit(null);
  };

  return (
    <>
      <div>
        <div className="">
          <Cards
            setInputDiv={setInputDiv}
            home={"true"}
            tasks={tasks}
            setTasks={setTasks}
            onTaskDelete={handleTaskDelete}
            onEditTask={handleEditTask}
            delBtn={delBtn}
          />
        </div>
      </div>
      <Inputdata
        InputDiv={inputDiv}
        setInputDiv={setInputDiv}
        onTaskAdded={handleTaskAdded}
        taskToEdit={taskToEdit}
        onTaskUpdated={handleTaskUpdated}
      />
    </>
  );
}

export default Alltask;
