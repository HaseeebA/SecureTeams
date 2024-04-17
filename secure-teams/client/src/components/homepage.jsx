import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import InformationPanel from "./infopanel";
import Sidepanel from "./sidepanel";
import CalendarHomeComponent from "./calendarHomeComponent";
import Dashboard from "./admin/dashboard";
import Team from "./team.jsx";
import axios from 'axios';
import '../styles/tasks.css';



const Homepage = () => {
	const defaultTheme = "#68d391";
	const [showSidePanel, setShowSidePanel] = useState(true);
	const [assignedTasks, setAssignedTasks] = useState([]);
	const email = localStorage.getItem("email");
	const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;


	const [theme, setTheme] = useState(
		localStorage.getItem("themeColor") || defaultTheme
	);
	const role = localStorage.getItem("role") || "Employee";

	// Side effect for initializing theme color
	useEffect(() => {
		document.documentElement.style.setProperty("--navbar-theme-color", theme);
		fetchAssignedTasks();
	}, [theme]); // Dependency on theme ensures this runs if theme changes

	const handleThemeChange = (newTheme) => {
		setTheme(newTheme);
		localStorage.setItem("themeColor", newTheme); // Update localStorage with new theme
		document.documentElement.style.setProperty(
			"--navbar-theme-color",
			newTheme
		);
	};

	const fetchAssignedTasks = async () => {
		try {
			const response = await axios.get(apiBaseUrl + "/tasks", {
				params: {
					userId: email
				}
			});
			setAssignedTasks(response.data);
		} catch (error) {
			console.log("Error fetching assigned tasks:", error);
			setAssignedTasks([]);
		}
	};

	//const role = localStorage.getItem("role");
	if (role === "admin") {
		return (
			<>
				<div>
					<Sidepanel show={showSidePanel} onThemeChange={handleThemeChange} />
					<Navbar selectedTheme={theme} role={role} />
					<InformationPanel />
					<div className="ml-10">
						<Dashboard />
					</div>
				</div>
				<Team />
			</>
		);
	} else {
		return (
			<>
				<div>
					<Sidepanel show={showSidePanel} onThemeChange={handleThemeChange} />
					<Navbar selectedTheme={theme} role={role} />
					<InformationPanel />
					<div className="flex justify-center items-center">
						<h1 className="text-4xl font-bold text-gray-800 mt-10">
							Welcome to Secure Teams
						</h1>
					</div>
					<div className="ml-10">
						<CalendarHomeComponent />
					</div>

					{/* <div className="flex flex-col h-screen">
						<div className="flex-grow flex justify-center items-center">
							<div className="container ml-8" style={{ backgroundColor: theme, color: 'white', maxHeight: '80vh', marginTop: '30px', overflow: 'auto', borderRadius: '10px', paddingTop: '0' }}></div>
							{role === 'employee' && (
								<div>
									<h2 className="text-lg font-semibold text-center" style={{ marginTop: '0' }}>Tasks</h2>
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
					</div> */}
				</div>

				<Team />
			</>
		);
	}
};

export default Homepage;
