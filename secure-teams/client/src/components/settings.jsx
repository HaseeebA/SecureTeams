import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./navbar";
import Sidepanel from "./sidepanel";
import "../styles/settings.css";

const Settings = () => {
	const [is2FAEnabled, setIs2FAEnabled] = useState(false);
	const [secondaryEmail, setSecondaryEmail] = useState("");
	const [showSidePanel, setShowSidePanel] = useState(true);
	const initialTheme = localStorage.getItem("themeColor") || "#68d391";
	const [theme, setTheme] = useState(initialTheme);

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

	const handleSecondaryEmailChange = (e) => {
		setSecondaryEmail(e.target.value);
	};

	const saveSettings = async () => {
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
			const response = await axios.post("http://localhost:3000/api/settings", {
				is2FAEnabled,
				secondaryEmail,
				userEmail,
			});
			alert(response.data.message);
			setSecondaryEmail("");
			setIs2FAEnabled(false);
		} catch (error) {
			console.error("Error saving settings:", error);
		}
	};

	return (
		<div>
			<Sidepanel show={showSidePanel} onThemeChange={handleThemeChange} />
			<Navbar selectedTheme={theme} />
			<div className="settings-container">
				<h2>Two Factor Authentication</h2>
				<label className="toggle">
					Enable 2FA:
					<input
						type="checkbox"
						checked={is2FAEnabled}
						onChange={handleToggle2FA}
					/>
				</label>
				{is2FAEnabled && (
					<div>
						<label>
							Secondary Email:
							<input
								type="email"
								value={secondaryEmail}
								onChange={handleSecondaryEmailChange}
							/>
						</label>
					</div>
				)}
				<button onClick={saveSettings} style={{ background: theme }}>
					{" "}
					Save Settings{" "}
				</button>
			</div>
		</div>
	);
};

export default Settings;
