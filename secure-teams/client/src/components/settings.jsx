import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./navbar";
import Sidepanel from "./sidepanel";
import Switch from "react-switch";
import "../styles/settings.css";
import { useSocket } from "../socketProvider";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
// console.log("API Base URL", apiBaseUrl);

const Settings = () => {
	const [is2FAEnabled, setIs2FAEnabled] = useState(false);
	const [isLogAlertsEnabled, setIsLogAlertsEnabled] = useState(false);
	const [secondaryEmail, setSecondaryEmail] = useState("");
	const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);
	const [showSidePanel, setShowSidePanel] = useState(true);
	const initialTheme = localStorage.getItem("themeColor") || "#68d391";
	const [theme, setTheme] = useState(initialTheme);
	const [password, setPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [error, setError] = useState("");
	const socket = useSocket();

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

	const handleToggleLogAlerts = () => {
		const role = localStorage.getItem("role");
		if (role === "admin") {
			setIsLogAlertsEnabled(!isLogAlertsEnabled);
		}
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
				setError("ERROR!! Password cannot be empty");
				return;
			}
			if (password === newPassword) {
				setError("ERROR!! New password cannot be the same as the old password");
				return;
			}
			if (newPassword.length < 8) {
				setError("ERROR!! Password must be at least 8 characters long");
				return;
			}

			const passwordRegex =
				/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

			if (!passwordRegex.test(newPassword)) {
				setError(
					"ERROR!! Password must contain at least one number and one special character"
				);
				return;
			}

			try {
				const userEmail = localStorage.getItem("email");
				const response = await axios.post(
					// "https://secureteams.onrender.com/api/updatePassword",
					apiBaseUrl + "/auth/updatePassword",
					{
						userEmail,
						password,
						newPassword,
					}
				);
				socket.emit("logActivity", {
					method: "POST",
					path: "/auth/updatePassword",
					email: userEmail,
				});

				if (response.status === 200) {
					setError(response.data.message);
					setPassword("");
					setNewPassword("");
					setIsPasswordEnabled(false);
				}
			} catch (error) {
				if (
					error.response &&
					(error.response.status === 400 || error.response.status === 401)
				) {
					setError(error.response.data.message);
					if (error.response.data.message === "Logging Out") {
						socket.emit("logAlert", {
							email: localStorage.getItem("email"),
							message: "logged out due to multiple incorrect password attempts",
							type: "danger",
						});
						localStorage.removeItem("token");
						window.location.href = "/";
						socket.emit("logout", { email: localStorage.getItem("email") });
					}
				} else {
					console.error("Error updating password:", error);
					setError("Error updating password. Please try again.");
				}
			}
		} else {
			if (is2FAEnabled && !secondaryEmail) {
				setError("ERROR!! Secondary email cannot be empty");
				return;
			}
			const emailRegex = new RegExp(/^[a-zA-Z0-9._%+-]+@(gmail|outlook)\.com$/);
			if (is2FAEnabled && !emailRegex.test(secondaryEmail)) {
				setError("ERROR!! Please enter a valid Gmail or Outlook email");
				return;
			}

			try {
				const userEmail = localStorage.getItem("email");
				const response = await axios.post(apiBaseUrl + "/auth/settings", {
					is2FAEnabled,
					secondaryEmail,
					userEmail,
				});
				socket.emit("logActivity", {
					method: "POST",
					path: "/auth/settings",
					email: userEmail,
				});
				setError(response.data.message);
				setSecondaryEmail("");
				setIs2FAEnabled(false);
				setIsLogAlertsEnabled(false);
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
				<h1 style={{ color: "white" }}>Settings</h1>
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

				{localStorage.getItem("role") === "admin" && (
					<label
						className="toggle"
						style={{
							marginBottom: "10px",
							display: "flex",
							justifyContent: "space-between",
							marginRight: "85px",
						}}
					>
						Enable Log Alerts
						<Switch
							onChange={handleToggleLogAlerts}
							checked={isLogAlertsEnabled}
						/>
					</label>
				)}

				{isLogAlertsEnabled && localStorage.getItem("role") === "admin" && (
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
				{error && (
					<p
						className="error-message"
						style={{ color: "yellow", fontSize: "1em" }}
					>
						{error}
					</p>
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
