import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import Sidepanel from "./sidepanel";
import "../styles/profile.css";
import axios from "axios";
import profile from "../images/q.png";

const Profile = () => {
	const [showSidePanel, setShowSidePanel] = useState(true);
	const initialTheme = localStorage.getItem("themeColor") || "#68d391";
	const [theme, setTheme] = useState(initialTheme);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [name, setName] = useState("");
	const [profilePhoto, setProfilePhoto] = useState(null);
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		const fetchProfileData = async () => {
			try {
				const response = await axios.get(
					"http://localhost:3000/api/profile?email=" +
						localStorage.getItem("email")
				);
				const { email, name, profilePhoto } = response.data;
				setEmail(email);
				setName(name);
				if (profilePhoto) {
					const profilePhotoUrl =
						"http://localhost:3000/uploads/" + profilePhoto;
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

		if (!email){
			alert("Email cannot be empty");
			return;
		}

		if (!password || !newPassword) {
			alert("Password cannot be empty");
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

		const formData = new FormData();
		formData.append("email", email);
		formData.append("password", password);
		formData.append("newPassword", newPassword);
		formData.append("name", name);
		formData.append("profilePhoto", profilePhoto);

		try {
			const response = await axios.post(
				"http://localhost:3000/api/update",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			alert(response.data.message);
			setPassword("");
			setNewPassword("");
			setIsEditing(false);
		} catch (error) {
			console.log(error);
			alert("Error updating profile");
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
						<div
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
						</div>
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