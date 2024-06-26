import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import Sidepanel from "./sidepanel";
import axios from "axios";
import "../styles/tasks.css";
import { useSocket } from "../socketProvider";

const TasksPage = () => {
	const initialTheme = localStorage.getItem("themeColor") || "#ddb892";
	const [theme, setTheme] = useState(initialTheme);
	const [inputTitle, setInputTitle] = useState("");
	const [inputDesc, setInputDesc] = useState("");
	const [selectedUser, setSelectedUser] = useState("");
	const [users, setUsers] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [assignedTasks, setAssignedTasks] = useState([]);
	const [teams, setTeams] = useState([]);
	const [role, setRole] = useState(localStorage.getItem("role") || "employee");
	const email = localStorage.getItem("email");
	const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
	// console.log("API Base URL", apiBaseUrl);
	const socket = useSocket();

	const fetchAssignedTasks = async () => {
		try {
			const response = await axios.get(apiBaseUrl + "/tasks", {
				params: {
					userId: email,
				},
			});
			setAssignedTasks(response.data);
		} catch (error) {
			console.log("Error fetching assigned tasks:", error);
			setAssignedTasks([]);
		}
	};

	useEffect(() => {
		fetchAssignedTasks();
		fetchTasks();
		fetchTeams();
	}, []);

	const fetchTeams = async () => {
		try {
			const response = await axios.get(apiBaseUrl + "/teamNames");
			// if (Array.isArray(response.data)) {
			setTeams(response.data);
			// } else {
			// console.error("Expected teams to be an array but received:", typeof response.data);
			// setTeams([]);
		} catch (error) {
			console.log("Error fetching teams:", error);
			setTeams([]);
		}
	};

	const fetchTasks = async () => {
		try {
			const response = await axios.get(`/api/tasks?userId=${email}`);
			if (Array.isArray(response.data)) {
				setTasks(response.data);
			} else {
				console.error(
					"Expected tasks to be an array but received:",
					typeof response.data
				);
				setTasks([]);
			}
		} catch (error) {
			console.log("Error fetching tasks:", error);
			setTasks([]);
		}
	};

	const handleThemeChange = (newTheme) => {
		setTheme(newTheme);
		document.documentElement.style.setProperty(
			"--navbar-theme-color",
			newTheme
		);
	};

	const handleAddTask = async (e) => {
		e.preventDefault();
		if (!inputTitle || !inputDesc || !selectedUser) {
			alert("Please fill in all fields and select a member.");
			return;
		}
		try {
			// Check if the selected user exists
			const userExists = users.some((user) => user.email === selectedUser);
			if (!userExists) {
				alert("Selected user does not exist.");
				return;
			}

			const newTask = {
				title: inputTitle,
				description: inputDesc,
				userId: selectedUser, // Ensure selectedUser is the correct email of the user
			};
			const response = await axios.post(apiBaseUrl + "/tasks", {
				...newTask,
			});
			if (response.status === 201) {
				const updatedTasks = [...tasks, response.data];
				setTasks(updatedTasks);
				setInputTitle("");
				setInputDesc("");
				alert("Task added successfully.");
			}
		} catch (error) {
			console.log("Error adding task:", error);
			alert("Error adding task. Please try again.");
		}
	};

	const handleTeamSelection = async (e) => {
		const teamName = e.target.value;
		if (!teamName) {
			return;
		}
		try {
			const response = await axios.get(apiBaseUrl + "/membersInTeam", {
				params: {
					teamName: teamName,
				},
			});
			setUsers(response.data);
			console.log(response.data);
		} catch (error) {
			console.log("Error fetching users:", error);
			setUsers([]);
		}
	};

	const handleNameSelection = async (e) => {
		const email = e.target.value;
		setSelectedUser(email);
	};

	const renderEmployeeTasksTable = () => {
		return (
			<div className="employee-tasks-container">
				<table>
					<thead>
						<tr>
							<th>Title</th>
							<th>Description</th>
							<th>Done</th>
						</tr>
					</thead>
					<tbody>
						{assignedTasks.map((task) => (
							<tr key={task._id}>
								<td>{task.title}</td>
								<td>{task.description}</td>
								<td>
									<input type="checkbox" />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	};

	return (
		<div>
			<div className="tasks-container">
				<div className="tasks-form">
					<div
						style={{
							// backgroundColor: theme,
							color: "white",
							maxHeight: "80vh",
							marginTop: "30px",
							overflow: "auto",
							paddingTop: "0",
						}}
					>
						{role === "manager" ? (
							<>
								<div className="team-selection-container">
									<div>
										<h2>Team Names:</h2>
										<select
											onChange={handleTeamSelection}
											style={{ color: "black", width: "200px" }}
										>
											<option value="">Select a team</option>
											{teams.map((team, index) => (
												<option key={index} value={team.name}>
													{team.name}
												</option>
											))}
										</select>
									</div>
									<div>
										<h2>Team Members:</h2>
										<select
											onChange={handleNameSelection}
											style={{ color: "black", width: "200px" }}
										>
											<option value="">Select a member</option>
											{/* Use names variable to render team members */}
											{users.map((member, index) => (
												<option key={index} value={member.email}>
													{member.email}
												</option>
											))}
										</select>
									</div>
								</div>

								<form onSubmit={handleAddTask} className="mx-auto max-w-md">
									<div className="mb-4">
										<h2>Task Title</h2>

										<input
											type="text"
											id="title"
											value={inputTitle}
											onChange={(e) => setInputTitle(e.target.value)}
											className="p-2 rounded border outline-none inputText"
										/>
									</div>
									<div className="mb-4">
										<h2>Task Description</h2>

										<input
											type="text"
											id="description"
											value={inputDesc}
											onChange={(e) => setInputDesc(e.target.value)}
											className="p-2 rounded border outline-none inputText"
										/>
									</div>
									<button
										type="submit"
										className="bg-white hover:bg-gray-500 text-black font-bold py-2 px-4 rounded"
									>
										Add Task
									</button>
								</form>
							</>
						) : (
							<div>
								{role === "team-member" && (
									<div>
										<h2
											className="font-semibold text-center"
											style={{ marginTop: "0", fontSize: "2rem" }}
										>
											Tasks
										</h2>
										<table className="tasks-table">
											<thead>
												<tr>
													<th>Task</th>
													<th>Description</th>
												</tr>
											</thead>
											<tbody>
												{assignedTasks.map((task) => (
													<tr key={task._id}>
														<td>{task.title}</td>
														<td>{task.description}</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default TasksPage;
