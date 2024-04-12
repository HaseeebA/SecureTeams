import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import Sidepanel from "./sidepanel";
import axios from "axios";
import "../styles/tasks.css";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
// console.log("API Base URL", apiBaseUrl);

//RMBR TO IMPLEMENT RESPONSIVE DESIGN

const TasksPage = () => {
	const initialTheme = localStorage.getItem("themeColor");
	const [theme, setTheme] = useState(initialTheme);
	const [inputTitle, setInputTitle] = useState("");
	const [inputDesc, setInputDesc] = useState("");
	const [selectedUser, setSelectedUser] = useState("");
	//const initialTheme = localStorage.getItem("themeColor") || "#68d391";
	const [users, setUsers] = useState([]); // Define users state
	const [tasks, setTasks] = useState([]);
	const [assignedTasks, setAssignedTasks] = useState([]);

	useEffect(() => {
		fetchUsers(); // Fetch users data
		fetchTasks();
	}, []);

	const fetchUsers = async () => {
		try {
			// const response = await axios.get("https://secureteams.onrender.com/api/newUsers");
			const response = await axios.get(apiBaseUrl + "/newUsers");
			console.log("Fetched Users:", response.data); // Log fetched users
			setUsers(response.data);
		} catch (error) {
			console.log("Error fetching users:", error);
		}
	};

	const fetchTasks = async () => {
		try {
			// const response = await axios.get("https://secureteams.onrender.com/api/tasks");
			const response = await axios.get(apiBaseUrl + "/tasks");
			setTasks(response.data);
			fetchAssignedTasks(response.data);
		} catch (error) {
			console.log("Error fetching tasks:", error);
		}
	};

	const handleThemeChange = (newTheme) => {
		setTheme(newTheme);
		document.documentElement.style.setProperty(
			"--navbar-theme-color",
			newTheme
		);
	};

	const fetchAssignedTasks = (tasks) => {
		const assignedTasks = tasks.filter(
			(task) => task.assignedTo === selectedUser
		);
		setAssignedTasks(assignedTasks);
	};

	const handleAddTask = async (e) => {
		e.preventDefault();
		if (!inputTitle || !inputDesc || !selectedUser) {
			alert("Please fill in all fields and select a member.");
			return;
		}
		try {
			const newTask = {
				title: inputTitle,
				description: inputDesc,
				assignedTo: selectedUser,
			};
			// const response = await axios.post("https://secureteams.onrender.com/api/tasks", newTask);
			const response = await axios.post(apiBaseUrl + "/tasks", newTask);
			if (response.status === 201) {
				setTasks([...tasks, response.data]);
				fetchAssignedTasks([...tasks, response.data]);
				setInputTitle("");
				setInputDesc("");
				alert("Task added successfully.");
			}
		} catch (error) {
			console.log("Error adding task:", error); // Log the entire error object
			alert("Error adding task. Please try again."); // Show a generic error message
		}
	};

	const handleSelectUser = (userId) => {
		// Rename to handleSelectUser
		setSelectedUser(userId);
	};

	return (
		<div className="flex flex-col h-screen">
			<Sidepanel show={true} onThemeChange={handleThemeChange} />
			<Navbar selectedTheme={theme} onThemeChange={handleThemeChange} />

			<div className="flex-grow flex justify-center items-center">
				{/* <div className="flex-grow"> */}
				<div
					className="container mx-auto max-w-md ml-8"
					style={{
						backgroundColor: theme,
						color: "white",
						maxHeight: "80vh",
						marginTop: "30px",
						overflow: "auto",
						borderRadius: "10px",
					}}
				>
					{/* <h2 className="text-lg font-semibold text-center">Tasks Page</h2> */}
					<h2 className="text-lg font-semibold text-center">
						WELCOME TO TASKS PAGE!
					</h2>
					<div className="text-center">
						<h2>Add New Task</h2>
						<form onSubmit={handleAddTask} className="mx-auto max-w-md">
							<div className="mb-4">
								<label htmlFor="title" className="mr-2">
									Title:
								</label>
								<input
									type="text"
									id="title"
									value={inputTitle}
									onChange={(e) => setInputTitle(e.target.value)}
									className="p-2 rounded border outline-none inputText" // Apply inputText class here
								/>
							</div>
							<div className="mb-4">
								<label htmlFor="description" className="mr-2">
									Description:
								</label>
								<input
									type="text"
									id="description"
									value={inputDesc}
									onChange={(e) => setInputDesc(e.target.value)}
									className="p-2 rounded border outline-none inputText" // Apply inputText class here
								/>
							</div>
							<div className="mb-4">
								<label htmlFor="user" className="mr-2">
									Assign To:
								</label>{" "}
								{/* Update label */}
								<select
									className="block appearance-none w-full bg-white border border-gray-400 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500"
									id="user" // Update id
									value={selectedUser}
									onChange={(e) => handleSelectUser(e.target.value)} // Update onChange event
								>
									<option value="">Select a user</option>
									{users.map((user) => (
										<option key={user.id} value={user.id}>
											{" "}
											{/* Update value */}
											{user.name} {/* Display user name */}
										</option>
									))}
								</select>
							</div>

							<button
								type="submit"
								className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
							>
								Add Task
							</button>
						</form>
					</div>
					<div>
						//<h2>Tasks</h2>
						<ul>
							{tasks.map((task) => (
								<li key={task.id}>
									<strong>{task.title}</strong>: {task.description}
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
			<div className="assigned-tasks-panel">
				<h2>Assigned Tasks</h2>
				<ul>
					{assignedTasks.map((task) => (
						<li key={task.id}>
							<strong>{task.title}</strong>: {task.description} (Assigned to:{" "}
							{task.assignedTo})
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default TasksPage;
