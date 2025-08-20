import { useState, useEffect } from "react";
import { RiCalendarTodoLine } from "react-icons/ri";
import axios from "axios";
import toast from "react-hot-toast";
import ListItem from "./ListItem";

const ToDoList = () => {
  // Initial state object for a task
  const initialValue = {
    todoValue: "",
    isCompleted: false,
  };

  const [addTask, setAddTask] = useState(initialValue);
  const [todoList, setTodoList] = useState([]);
  const [isListLoading, setIsListLoading] = useState(true);
  const [isButtonLoading, setButtonLoading] = useState(false);

  const API_BACKEND = import.meta.env.VITE_API_BASE_URL;

  // fetch data using axios with async/await try/catch block
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BACKEND}/get`);

      setTodoList(response.data);
    } catch (error) {
      console.error(`${error.status} ${error.code}`);
    } finally {
      setIsListLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update input value
  const handleChange = (event) => {
    const { name, value } = event.target;
    setAddTask({ ...addTask, [name]: value });
  };

  // Add a new task or update an existing one
  const handleAddTask = (event) => {
    event.preventDefault();
    // check the field is not just whitespace
    if (!addTask.todoValue.trim()) return;

    if (addTask._id) {
      const updateTask = { ...addTask, todoValue: addTask.todoValue.trim() };

      const headers = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      setButtonLoading(true);
      async function updateData() {
        try {
          await axios.put(
            `${API_BACKEND}/update/${addTask._id}`,
            updateTask,
            headers
          );

          await fetchData();
          toast.success("Task updated");
          setAddTask(initialValue);
        } catch (error) {
          console.error(`${error.status} ${error.code}`);
          toast.error(`${error.status} ${error.code}`);
        } finally {
          setButtonLoading(false);
        }
      }
      updateData();
    } else {
      // Create a new task
      const newTask = {
        todoValue: addTask.todoValue.trim(),
        isCompleted: false,
      };

      const headers = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      setButtonLoading(true);
      async function postData() {
        try {
          await axios.post(`${API_BACKEND}/new`, newTask, headers);

          await fetchData();
          toast.success("Task created");
          setAddTask(initialValue);
        } catch (error) {
          console.error(`${error.status} ${error.code}`);
          toast.error(`${error.status} ${error.code}`);
        } finally {
          setButtonLoading(false);
        }
      }
      postData();
    }
  };

  // buttonText function to show button text during and after api call
  const buttonText = () => {
    if (isButtonLoading) {
      return "Processing...";
    } else if (addTask._id) {
      return "UPDATE +";
    } else {
      return "ADD +";
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="w-[32rem] m-4 min-h-[24rem] flex flex-col justify-start items-start px-8 py-6 space-y-6 rounded-xl overflow-hidden border border-gray-300 shadow-lg bg-white">
        <div className="flex gap-3 justify-center items-center text-3xl font-semibold text-gray-800">
          <RiCalendarTodoLine />
          <h1>To-Do List</h1>
        </div>

        {/* Form submission handles both button click and Enter key */}
        <form onSubmit={handleAddTask} className="w-full relative">
          <input
            id="todoValue"
            name="todoValue"
            type="text"
            required
            className="block w-full p-3 ps-4 pe-24 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-100 focus:ring-purple-500 focus:border-purple-500"
            value={addTask.todoValue}
            onChange={(e) => {
              if (!isButtonLoading) {
                handleChange(e);
              }
            }}
            placeholder="Add your task..."
            autoComplete="off"
          />

          <button
            type="submit"
            disabled={isButtonLoading}
            className={`absolute right-2.5 bottom-[0.30rem] text-white font-semibold rounded-md text-sm px-4 py-2 
      ${
        isButtonLoading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-purple-600 hover:bg-purple-700 transition duration-200"
      }`}
          >
            {buttonText()}
          </button>
        </form>

        {/* Render tasks using ListItem component */}
        <ListItem
          todoList={todoList}
          setTodoList={setTodoList}
          setAddTask={setAddTask}
          isListLoading={isListLoading}
          fetchData={fetchData}
        />
      </div>
    </div>
  );
};

export default ToDoList;
