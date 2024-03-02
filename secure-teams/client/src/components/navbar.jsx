import React, { useState, useEffect } from "react";
import "../index.css";
import face from "../images/face.png";
import profile from "../images/q.png";
import "../styles/navbar.css";
import { NavLink } from "react-router-dom";
import axios from "axios";

const Navbar = ({ selectedTheme }) => {
	console.log("navbar ", selectedTheme);
	const [profilePhoto, setProfilePhoto] = useState(null);
	const [isProfileOpen, setProfileOpen] = useState(false);

	useEffect(() => {
		const fetchProfileData = async () => {
			try {
				const response = await axios.get(
					"http://localhost:3000/api/profile?email=" +
						localStorage.getItem("email")
				);
				const { email, name, profilePhoto } = response.data;
				if (profilePhoto) {
					const profilePhotoUrl = "http://localhost:3000/uploads/" + profilePhoto;
					setProfilePhoto(profilePhotoUrl);
				}
			} catch (error) {
				console.error("Error fetching profile data:", error);
			}
		};
		fetchProfileData();
	}, []);

	const handleProfileClick = (event) => {
		setProfileOpen(!isProfileOpen);
		event.stopPropagation();
	};

	const handleClickOutside = (event) => {
		if (
			!event.target.closest(".profile-button") &&
			!event.target.closest(".profile-dropdown")
		) {
			setProfileOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("click", handleClickOutside);

		const storedTheme = localStorage.getItem("themeColor") || selectedTheme;
		document.documentElement.style.setProperty(
			"--navbar-theme-color",
			storedTheme
		);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [selectedTheme]);

	return (
		<div className="navbar" style={{ backgroundColor: selectedTheme }}>
			<div className="flex items-center">
				<img src={face} alt="Icon" className="w-10 h-10 mr-2 rounded-full" />
			</div>

			<div className="flex-1 text-center">
				<input
					type="text"
					placeholder="Search"
					className="border p-2 rounded-md w-full max-w-xs mx-auto"
				/>
			</div>

			<div className="relative inline-block">
				<img
					src={profilePhoto || profile}
					alt="Profile"
					className="profile-button w-10 h-10 rounded-full cursor-pointer"
					onClick={handleProfileClick}
				/>

				{isProfileOpen && (
					<div className="profile-dropdown show">
						<button className="block w-full px-4 py-2 text-left hover:bg-gray-200">
							<NavLink to="/profile">Profile</NavLink>
						</button>
						<button className="block w-full px-4 py-2 text-left hover:bg-gray-200">
							Settings
						</button>
						<button
							className="block w-full px-4 py-2 text-left hover:bg-gray-200"
							onClick={() => {
								localStorage.removeItem("token");
								window.location.href = "/";
							}}
						>
							Logout
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Navbar;
