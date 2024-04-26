import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import InformationPanel from "./infopanel";
import Sidepanel from "./sidepanel";
import CalendarHomeComponent from "./calendarHomeComponent";
import Dashboard from "./admin/dashboard";
import axios from "axios";
import Taskspage from "./tasksHomeComponent.jsx";
import "../styles/homepage.css";

const Homepage = () => {
	const defaultTheme = "#ddb892";
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
					userId: email,
				},
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
					<Sidepanel show={false} onThemeChange={handleThemeChange} />
					<Navbar selectedTheme={theme} role={role} />
					<InformationPanel />
					<div className="ml-10">
						<Dashboard />
					</div>
				</div>
			</>
		);
	} else {
		return (
			<>
			<div className="homepagepc-container">
				<Sidepanel show={false} onThemeChange={handleThemeChange} />
				<Navbar selectedTheme={theme} role={role} />
				<div style={{ display: "grid", gridTemplateColumns: "2fr 2fr" }}>
				<div className="homepage-content"> 
              </div>
              <div className="flex justify-center items-center">
				<div>
					
				</div>
				{/* <h1 className="text-title mt-10" style={{ color: theme }}>
                    Welcome to Secure Teams!
                </h1> */}
                </div>
					<div className="ml-4 mt-6">
						<CalendarHomeComponent />
					</div>
					<div>
						<Taskspage />
					</div>
				</div>
				<InformationPanel />
				</div>
			</>
		);
	  }
	};
	
	export default Homepage;
