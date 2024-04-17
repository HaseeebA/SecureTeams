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
	const [userNames, setUserNames] = useState([]);
	const [sortAsc, setSortAsc] = useState(true);
	const makeWhite = ["#0b1623", "#540D0D", "#013220"];
	const [role, setRole] = useState(localStorage.getItem('role') || 'employee');
	const [isDarkTheme, setIsDarkTheme] = useState(
		makeWhite.includes(initialTheme)
	);
	const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
	const [teamMembers, setTeamMembers] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [teamName, setTeamName] = useState('');
	const [selectedMembers, setSelectedMembers] = useState([]);
	// console.log("API Base URL", apiBaseUrl);
	const socket = useSocket();
	const numberOfMembers = 5;

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

		const fetchNames = async () => {
			try {
				const response = await axios.get(apiBaseUrl + "/userDetails");
				setUserNames(response.data);
			}
			catch (error) {
				console.log("Error fetching user names:", error);
			}
		};

		const fetchTeamMembers = async () => {
			try {
				// Make an API call to fetch team members' data
				const response = await axios.get(apiBaseUrl + "/teams", {
					params: {
						email: localStorage.getItem("email")
					}
				});

				// Update state with fetched team members' data
				console.log("Team members:", response.data)
				setTeamMembers(response.data);
			} catch (error) {
				console.log("Error fetching team members:", error);
				// Handle error scenario, e.g., show error message to the user
			}
		};

		fetchUsers();
		fetchNames();
		fetchTeamMembers();
	}, []);

	const handleEditTeam = () => {
		// Placeholder code for handling edit team action
		console.log("Editing current team...");
		// You can replace this with actual logic for editing the team
	};

	const handleCreateNewTeam = async () => {
		// Assuming you have the necessary data available
		const teamName1 = teamName; // Replace with actual team name
		const memberEmails = selectedMembers; // Replace with actual member emails

		try {

			const response = axios.post(apiBaseUrl + '/createTeams', {
				teamName: teamName1,
				memberEmails: memberEmails
			});

			console.log(response)
			if (response.ok) {
				console.log("Team created successfully");
				setTeamName('');
				setSelectedMembers([]);
				// Optionally, you can redirect the user to another page or update the UI as needed
			} else {
				console.error("Failed to create team:");
				// Handle error scenario, e.g., show error message to the user
			}
		} catch (error) {
			console.error("An error occurred while creating the team:", error);
			// Handle error scenario, e.g., show error message to the user
		}
	};

	const handleTeamNameChange = (e) => {
		setTeamName(e.target.value);
	};

	const handleSaveTeam = () => {
		setShowModal(false);
		handleCreateNewTeam();
		setTeamName('');
		setSelectedMembers([]);
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
				{role === 'manager' ? (
					<>
						<h1 className={`members-header ${isDarkTheme ? "text-white" : ""}`}>
							Teams
						</h1>
						<div className="edit-create-options">
							<button onClick={() => setShowModal(true)}>Create New Team</button>
						</div>
						{/* Render modal or form when showModal is true */}
						{showModal && (
							<div className="">
								<div className="">
									<span className="close" onClick={() => setShowModal(false)}>×</span>
									<input type="text" value={teamName} onChange={handleTeamNameChange} placeholder="Enter team name" style={{ color: 'black' }} />
									<select
										multiple
										className="block appearance-none w-full bg-white border border-gray-400 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500"
										value={selectedMembers}
										onChange={(e) => setSelectedMembers(Array.from(e.target.selectedOptions, option => option.value))}
									>
										{/* Render options for selecting multiple users */}
										{names.map((user, index) => (
											<option key={index} value={user.email}>
												{user.email}
												{/* ({user.role}) */}
											</option>
										))}
									</select>
									<button onClick={handleSaveTeam}>Save</button>
								</div>
							</div>
						)}
					</>
				) : (
					<div>
						{teamMembers.map((team) => (
							<div key={team._id}>
								<h2>Team Name: {team.name}</h2>
								<div className="team-members-grid">
									{team.members.map((email, index) => {
										const user = userNames.find((user) => user.email === email);
										return (
											<div key={index} className="team-member-item">
												<div><strong>Name:</strong> {user ? user.name : "Unknown"}</div>
												<div><strong>Email:</strong> {email}</div>
											</div>
										);
									})}
								</div>
							</div>
						))}
					</div>

				)}
			</div>
		</>
	);
};

export default Members;
