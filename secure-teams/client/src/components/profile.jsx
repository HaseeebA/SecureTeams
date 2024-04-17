import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import Sidepanel from "./sidepanel";
import "../styles/profile.css";
import axios from "axios";
import profile from "../images/q.png";
import { useSocket } from "../socketProvider";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
// console.log("API Base URL", apiBaseUrl);

const Profile = () => {
	const [showSidePanel, setShowSidePanel] = useState(true);
	const initialTheme = localStorage.getItem("themeColor") || "#68d391";
	const [theme, setTheme] = useState(initialTheme);
	const [email, setEmail] = useState("");
	// const [password, setPassword] = useState("");
	// const [newPassword, setNewPassword] = useState("");
	const [name, setName] = useState("");
	const [profilePhoto, setProfilePhoto] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [error, setError] = useState("");

	const socket = useSocket();

	useEffect(() => {
		const fetchProfileData = async () => {
			try {
				// const response = await axios.get(
				// 	"https://secureteams.onrender.com/api/profile?email=" +
				// 		localStorage.getItem("email")
				// );
				const response = await axios.get(
					apiBaseUrl + "/profile?email=" + localStorage.getItem("email")
				);
				socket.emit("logActivity", {
					method: "GET",
					path: "/profile?email=" + localStorage.getItem("email"),
					email: localStorage.getItem("email"),
				});
				const { email, name, profilePhoto } = response.data;
				setEmail(email);
				setName(name);
				if (profilePhoto) {
					const profilePhotoUrl =
						// "https://secureteams.onrender.com/uploads/" + profilePhoto;
						apiBaseUrl + "/uploads/" + profilePhoto;
					setProfilePhoto(profilePhotoUrl);
				}
			} catch (error) {
				console.error("Error fetching profile data:", error);
			}
		};

		fetchProfileData();
	}, []);

	const handleThemeChange = (newTheme) => {
		setTheme(newTheme);
		document.documentElement.style.setProperty(
			"--navbar-theme-color",
			newTheme
		);
	};

	const handleUpdate = async (event) => {
		event.preventDefault();

		if (!email) {
			setError("Email cannot be empty");
			return;
		}

		// if (!password || !newPassword) {
		// 	alert("Password cannot be empty");
		// 	return;
		// }

		// if (!/\d/.test(newPassword)) {
		// 	alert("Password must contain at least one number");
		// 	return;
		// }

		// if (!/[!@#$%^&*.]/.test(newPassword)) {
		// 	alert("Password must contain at least one special character");
		// 	return;
		// }

		const formData = new FormData();
		formData.append("email", email);
		// formData.append("password", password);
		// formData.append("newPassword", newPassword);
		formData.append("name", name);
		formData.append("profilePhoto", profilePhoto);

		try {
			const response = await axios.post(
				// "https://secureteams.onrender.com/api/update",
				apiBaseUrl + "/update",
				formData,
				email,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			socket.emit("logActivity", {
				method: "POST",
				path: "/update",
				email: email,
			});
			
			// setPassword("");
			// setNewPassword("");
			setIsEditing(false);
		} catch (error) {
			console.log(error);
			if(error.response.data.message)
			{
				setError(error.response.data.message);
			}
			else{
				setError("Error updating profile");
			}
		}
	};

	return (
		<div>
			<Sidepanel show={showSidePanel} onThemeChange={handleThemeChange} />
			<Navbar selectedTheme={theme} />

			<div className="profile-container">
				<div className="profile-form" style={{ backgroundColor: theme }}>
					<h1>Profile</h1>
					<form onSubmit={handleUpdate}>
						<div className="form-group profile-photo">
							<label htmlFor="profilePhoto">Profile Photo</label>
							{isEditing ? (
								<input
									type="file"
									id="profilePhoto"
									onChange={(event) => setProfilePhoto(event.target.files[0])}
									style={{ color: "white" }}
								/>
							) : (
								<img
									src={profilePhoto || profile}
									alt="Profile"
									className="w-32 h-32 rounded-full"
								/>
							)}
						</div>
						<div className="form-group">
							<label htmlFor="email">Email</label>
							{isEditing ? (
								<input
									type="email"
									id="email"
									value={email}
									onChange={(event) => setEmail(event.target.value)}
								/>
							) : (
								<p>{email}</p>
							)}
						</div>
						<div className="form-group">
							<label htmlFor="name">Name</label>
							{isEditing ? (
								<input
									type="text"
									id="name"
									value={name}
									onChange={(event) => setName(event.target.value)}
								/>
							) : (
								<p>{name}</p>
							)}
						</div>
						{/* <div
							className="form-group"
							style={{ display: isEditing ? "block" : "none" }}
						>
							<label htmlFor="password">Password</label>
							<input
								type="password"
								id="password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
							/>
						</div>
						<div
							className="form-group"
							style={{ display: isEditing ? "block" : "none" }}
						>
							<label htmlFor="newPassword">New Password</label>
							<input
								type="password"
								id="newPassword"
								value={newPassword}
								onChange={(event) => setNewPassword(event.target.value)}
							/>
						</div> */}
						{error && (
							<p
								className="error-message"
								style={{ color: 'yellow', fontSize: '1em'}}
							>
								{error}
							</p>
						)}
						<button
							className="update-button"
							type="submit"
							style={{ display: isEditing ? "block" : "none" }}
						>
							Update
						</button>
					</form>
					<button
						onClick={() => setIsEditing(!isEditing)}
						className="edit-button"
					>
						{isEditing ? "Cancel" : "Edit"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Profile;
