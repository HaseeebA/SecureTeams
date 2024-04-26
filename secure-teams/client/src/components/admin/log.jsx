import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../navbar";
import Sidepanel from "../sidepanel";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

function LogList() {
	const [logFiles, setLogFiles] = useState([]);
	const [showSidePanel, setShowSidePanel] = useState(true);
	const initialTheme = localStorage.getItem("themeColor");
	const [theme, setTheme] = useState(initialTheme);

	const handleThemeChange = (newTheme) => {
		setTheme(newTheme);
		document.documentElement.style.setProperty(
			"--navbar-theme-color",
			newTheme
		);
	};

	useEffect(() => {
		axios
			.get(apiBaseUrl + "/allLogs")
			.then((response) => {
				setLogFiles(response.data);
			})
			.catch((error) => {
				console.error("Error fetching log file names:", error);
			});
	}, []);

	return (
		<div>
			<Navbar selectedTheme={theme} />
			<Sidepanel show={showSidePanel} onThemeChange={handleThemeChange} />
			<div className="flex-2 p-7 ml-60 mr-60">
				<h2>All Log Files</h2>
				<ul>
					{logFiles.map((log, index) => (
						<li
							key={index}
							onClick={() => (window.location.href = `/logfile/${log}`)}
							style={{ cursor: "pointer", color: "blue" }}
						>
							{log}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default LogList;
