import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../navbar";
import Sidepanel from "../sidepanel";
import { useParams } from "react-router-dom";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const SpecificLog = () => {
	const [logContent, setLogContent] = useState("");
	const [showSidePanel, setShowSidePanel] = useState(true);
	const initialTheme = localStorage.getItem("themeColor");
	const [theme, setTheme] = useState(initialTheme);
	const { logFileName } = useParams(); // Use useParams hook directly

	const handleThemeChange = (newTheme) => {
		setTheme(newTheme);
		document.documentElement.style.setProperty(
			"--navbar-theme-color",
			newTheme
		);
	};

	useEffect(() => {
		// Fetch the content of the specific log file from the backend
		axios
			.get(apiBaseUrl + "/logFile/" + logFileName)
			.then((response) => {
				setLogContent(response.data);
			})
			.catch((error) => {
				console.error("Error fetching log file content:", error);
			});
	}, [logFileName]); // Update the dependency to logFileName

	return (
		<div>
			<Navbar selectedTheme={theme} />
			<Sidepanel show={showSidePanel} onThemeChange={handleThemeChange} />
			<div className="flex-2 p-7 ml-60 mr-60">
				<h2>Log File: {logFileName}</h2>
				<pre>{logContent}</pre>
			</div>
		</div>
	);
};

export default SpecificLog;
