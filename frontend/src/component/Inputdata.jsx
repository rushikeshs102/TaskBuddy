import React, { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";

function Inputdata({
  InputDiv,
  setInputDiv,
  onTaskAdded,
  taskToEdit,
  onTaskUpdated,
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");

  const resetForm = () => {
    setTitle("");
    setDesc("");
    setError("");
  };

  useEffect(() => {
    if (InputDiv === "fixed" && taskToEdit) {
      setTitle(taskToEdit.Title);
      setDesc(taskToEdit.Description);
    } else if (InputDiv === "fixed") {
      resetForm();
    }
  }, [InputDiv, taskToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !desc) {
      setError("Both title and description are required.");
      return;
    }

    try {
      if (taskToEdit) {
        const response = await axios.put(
          `http://localhost:8081/tasks/${taskToEdit.TaskID}`,
          {
            title,
            desc,
          }
        );
        if (response.data.Status === "Task updated successfully") {
          onTaskUpdated();
          setInputDiv("hidden");
          resetForm();
        }
      } else {
        const response = await axios.post("http://localhost:8081/addtask", {
          title,
          desc,
        });
        if (response.data.Status === "Task added successfully") {
          onTaskAdded();
          setInputDiv("hidden");
          resetForm();
        }
      }
    } catch (error) {
      console.error("Failed to add/update task:", error);
    }
  };

  const handleCloseForm = () => {
    setInputDiv("hidden");
    resetForm();
    onTaskUpdated();
  };

  return (
    <>
      <div
        className={`${InputDiv} top-0 left-0 bg-gray-700 opacity-50 h-screen w-full`}
      ></div>
      <div
        className={`${InputDiv} top-0 left-0 flex justify-center items-center h-screen w-full`}
      >
        <div className="bg-gray-800 w-full max-w-md p-3 flex flex-col gap-2 rounded-md lg:w-2/6">
          <button onClick={handleCloseForm} className="flex justify-end">
            <RxCross2 className="hover:bg-gray-600 transition-all duration-300 text-xl" />
          </button>
          {error && <p className="text-red-500">{error}</p>}
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              name="title"
              className="rounded p-2 bg-gray-500 text-gray-300"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              name="desc"
              cols="30"
              rows="10"
              placeholder="Description"
              className="rounded p-2 bg-gray-500 text-gray-300"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            ></textarea>
            <button
              type="submit"
              className="rounded-md p-2 bg-green-500 hover:bg-green-600 text-black font-semibold transition-all duration-300"
            >
              {taskToEdit ? "Update Task" : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Inputdata;
