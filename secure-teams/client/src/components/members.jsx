import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import Sidepanel from "./sidepanel";
import axios from "axios";
import "../styles/members.css";
import { useSocket } from "../socketProvider";

const Members = () => {
	const [showSidePanel, setShowSidePanel] = useState(true);
	const initialTheme = localStorage.getItem("themeColor") || "#68d391";
	const [theme, setTheme] = useState(initialTheme);
	const [names, setNames] = useState([]);
	const [sortAsc, setSortAsc] = useState(true);
	const makeWhite = ["#0b1623", "#540D0D", "#013220"];
	const [isDarkTheme, setIsDarkTheme] = useState(
		makeWhite.includes(initialTheme)
	);
	const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
	// console.log("API Base URL", apiBaseUrl);
	const socket = useSocket();

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				// const response = await axios.get("https://secureteams.onrender.com/api/members");
				const response = await axios.get(apiBaseUrl + "/members");
				socket.emit("logActivity", {
					method: "GET",
					path: "/members",
					email: localStorage.getItem("email"),
				});
				// console.log("Members:", response.data);
				setNames(response.data);
			} catch (error) {
				console.log("Error fetching members:", error);
			}
		};

		fetchUsers();
	}, []);

	const toggleSortOrder = () => {
		setSortAsc(!sortAsc);
		setNames((prevNames) => {
			const sortedNames = [...prevNames].sort((a, b) => {
				if (sortAsc) return a.localeCompare(b);
				return b.localeCompare(a);
			});
			return sortedNames;
		});
	};

	const handleThemeChange = (newTheme) => {
		setTheme(newTheme);
		document.documentElement.style.setProperty(
			"--navbar-theme-color",
			newTheme
		);
		setIsDarkTheme(makeWhite.includes(newTheme));
	};

	return (
		<>
			<Sidepanel show={showSidePanel} onThemeChange={handleThemeChange} />
			<Navbar selectedTheme={theme} />
			<div className="members-container">
				<div className="members-header-container">
					<h1 className={`members-header ${isDarkTheme ? "text-white" : ""}`}>
						Members
					</h1>
					<button onClick={toggleSortOrder} className="sort-button">
						Sort {sortAsc ? "Descending" : "Ascending"}
					</button>
				</div>
				<ul className="members-list">
					{names.map((name, index) => (
						<li key={index}>{name}</li>
					))}
				</ul>
			</div>
		</>
	);
};

export default Members;
