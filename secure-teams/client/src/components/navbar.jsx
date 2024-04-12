import React, { useState, useEffect } from "react";
import "../index.css";
import face from "../images/face.png";
import profile from "../images/q.png";
import "../styles/navbar.css";
import { NavLink } from "react-router-dom";
import axios from "axios";

const Navbar = ({ selectedTheme }) => {
	const [profilePhoto, setProfilePhoto] = useState(null);
	const [isProfileOpen, setProfileOpen] = useState(false);
	const [invertImages, setInvertImages] = useState(false);
	const noHoverColors = ["#0b1623", "#540D0D", "#013220"];

	useEffect(() => {
		const fetchProfileData = async () => {
			try {
				const response = await axios.get(
					"https://secureteams.onrender.com/api/profile?email=" +
					localStorage.getItem("email")
				);
				const { email, name, profilePhoto } = response.data;
				if (profilePhoto) {
					const profilePhotoUrl = "https://secureteams.onrender.com/uploads/" + profilePhoto;
					setProfilePhoto(profilePhotoUrl);
				}
			} catch (error) {
				console.error("Error fetching profile data:", error);
			}
		};
		fetchProfileData();
	}, []);

	useEffect(() => {
		const shouldInvert = noHoverColors.includes(localStorage.getItem("themeColor"));
		setInvertImages(shouldInvert);
	  }, [selectedTheme]);

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
				<NavLink to="/homepage" className="text-2xl font-bold text-white">
				<img src={face} alt="Icon" className={`w-10 h-10 mr-2 rounded-full ${invertImages ? "invert" : ""}`}
          />
				</NavLink>
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
							<NavLink to="/settings">Settings</NavLink>
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
