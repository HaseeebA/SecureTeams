import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./navbar";
import Sidepanel from "./sidepanel";
import Switch from "react-switch";
import "../styles/settings.css";

const Settings = () => {
	const [is2FAEnabled, setIs2FAEnabled] = useState(false);
	const [secondaryEmail, setSecondaryEmail] = useState("");
	const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);
	const [showSidePanel, setShowSidePanel] = useState(true);
	const initialTheme = localStorage.getItem("themeColor") || "#68d391";
	const [theme, setTheme] = useState(initialTheme);
	const [password, setPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");

	const handleThemeChange = (newTheme) => {
		setTheme(newTheme);
		document.documentElement.style.setProperty(
			"--navbar-theme-color",
			newTheme
		);
	};

	const handleToggle2FA = () => {
		setIs2FAEnabled(!is2FAEnabled);
	};

	const handleTogglePassword = () => {
		setIsPasswordEnabled(!isPasswordEnabled);
	};

	const handleSecondaryEmailChange = (e) => {
		setSecondaryEmail(e.target.value);
	};

	const saveSettings = async () => {
		console.log("Saving settings");
		if (isPasswordEnabled) {
			if (!password || !newPassword) {
				alert("Password cannot be empty");
				return;
			}
			if (password === newPassword) {
				alert("New password cannot be the same as the old password");
				return;
			}
			if (newPassword.length < 6) {
				alert("Password must be at least 6 characters long");
				return;
			}

			// const passwordRegex =
			// 	/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

			// if (!passwordRegex.test(newPassword)) {
			// 	alert(
			// 		"Password must contain at least one number and one special character"
			// 	);
			// 	return;
			// }

			try {
				const userEmail = localStorage.getItem("email");
				const response = await axios.post(
					"http://localhost:3000/api/updatePassword",
					{
						userEmail,
						password,
						newPassword,
					}
				);

				if (response.status === 200) {
					alert(response.data.message);
					setPassword("");
					setNewPassword("");
					setIsPasswordEnabled(false);
				}
			} catch (error) {
				if (
					error.response &&
					(error.response.status === 400 || error.response.status === 401)
				) {
					alert(error.response.data.message);
				} else {
					console.error("Error updating password:", error);
					alert("Error updating password. Please try again.");
				}
			}
		} else {
			if (is2FAEnabled && !secondaryEmail) {
				alert("Secondary email cannot be empty");
				return;
			}
			const emailRegex = new RegExp(/^[a-zA-Z0-9._%+-]+@(gmail|outlook)\.com$/);
			if (is2FAEnabled && !emailRegex.test(secondaryEmail)) {
				alert("Please enter a valid Gmail or Outlook email");
				return;
			}

			try {
				const userEmail = localStorage.getItem("email");
				const response = await axios.post(
					"http://localhost:3000/api/settings",
					{
						is2FAEnabled,
						secondaryEmail,
						userEmail,
					}
				);
				alert(response.data.message);
				setSecondaryEmail("");
				setIs2FAEnabled(false);
			} catch (error) {
				console.error("Error saving settings:", error);
			}
		}
	};

	return (
		<div>
			<Sidepanel show={showSidePanel} onThemeChange={handleThemeChange} />
			<Navbar selectedTheme={theme} />
			<div
				className="settings-container"
				style={{ background: theme, color: "white" }}
			>
				<h2>Two Factor Authentication</h2>
				<label
					className="toggle"
					style={{
						marginBottom: "10px",
						display: "flex",
						justifyContent: "space-between",
						marginRight: "85px",
					}}
				>
					Enable 2FA
					<Switch onChange={handleToggle2FA} checked={is2FAEnabled} />
				</label>

				{is2FAEnabled && (
					<div>
						<label>
							Secondary Email:
							<input
								type="email"
								value={secondaryEmail}
								onChange={handleSecondaryEmailChange}
								style={{ color: "black" }}
							/>
						</label>
					</div>
				)}
				<label
					className="toggle"
					style={{
						marginBottom: "10px",
						display: "flex",
						justifyContent: "space-between",
						marginRight: "85px",
					}}
				>
					Update Password
					<Switch onChange={handleTogglePassword} checked={isPasswordEnabled} />
				</label>

				{isPasswordEnabled && (
					<>
						<div className="form-group">
							<label htmlFor="password">Password</label>
							<input
								type="password"
								id="password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								style={{ color: "black" }}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="newPassword">New Password</label>
							<input
								type="password"
								id="newPassword"
								value={newPassword}
								onChange={(event) => setNewPassword(event.target.value)}
								style={{ color: "black" }}
							/>
						</div>
					</>
				)}

				<button
					onClick={saveSettings}
					style={{ background: "white", color: "black" }}
				>
					{" "}
					Save Settings{" "}
				</button>
			</div>
		</div>
	);
};

export default Settings;
