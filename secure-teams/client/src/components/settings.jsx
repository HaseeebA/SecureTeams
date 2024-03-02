import React, { useState } from "react";
import Navbar from "./navbar";
import Sidepanel from "./sidepanel";
import { Link } from "react-router-dom";
import "../styles/settings.css";
import axios from "axios";

const Settings = () => {
	const [showSidePanel, setShowSidePanel] = useState(true);
	const initialTheme = localStorage.getItem("themeColor") || "#68d391";
	console.log("initial theme:", initialTheme);
	const [theme, setTheme] = useState(initialTheme);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");

	const handleThemeChange = (newTheme) => {
		setTheme(newTheme);
		document.documentElement.style.setProperty(
			"--navbar-theme-color",
			newTheme
		);
		console.log("homepage theme:", newTheme);
	};

	const handleUpdate = async (event) => {
		event.preventDefault();
		if (!email || !password || !newPassword) {
			alert("All fields are required");
			return;
		}
		if (password === newPassword) {
			alert("New password cannot be the same as old password");
			return;
		}
		if (newPassword.length < 8) {
			alert("Password must be at least 8 characters long");
			return;
		}
		if (!/\d/.test(newPassword)) {
			alert("Password must contain at least one number");
			return;
		}
		if (!/[!@#$%^&*.]/.test(newPassword)) {
			alert("Password must contain at least one special character");
			return;
		}

		try {
			const response = await axios.post("http://localhost:3000/api/update", {
				email: email,
				password: password,
				newPassword: newPassword,
			});
			console.log(response.data);
			alert("Password updated successfully");
            setPassword("");
            setNewPassword("");
		} catch (error) {
			console.error(
				"There was an error updating the email and password",
				error
			);
			alert(error.response.data.message);
		}
	};

	return (
		<div>
			<Sidepanel show={showSidePanel} onThemeChange={handleThemeChange} />
			<Navbar selectedTheme={theme} />

			<div
				className="settings-container"
				style={{ left: "250px", right: "250px", top: "250px" }}
			>
				<h1 className="heading">Settings</h1>
				<main className="settings-content" style={{ backgroundColor: theme }}>
					<form className="settings-form" onSubmit={handleUpdate}>
						<label htmlFor="email">Email</label>
						<input
							type="email"
							id="email"
							name="email"
							placeholder="Enter your new email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>

						<label htmlFor="password">Old Password</label>
						<input
							type="password"
							id="password"
							name="password"
							placeholder="Enter your old password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>

						<label htmlFor="newPassword">New Password</label>
						<input
							type="password"
							id="newPassword"
							name="newPassword"
							placeholder="Enter your new password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
						/>

						<button type="submit" className="update-button">
							Update
						</button>
					</form>
				</main>
			</div>
		</div>
	);
};

export default Settings;
