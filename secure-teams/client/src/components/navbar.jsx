import React, { useState, useEffect } from "react";
import "../index.css";
import face from "../images/face.png";
import profile from "../images/q.png";
import menu from "../images/menu.png";
import "../styles/navbar.css";

const Navbar = ({ selectedTheme }) => {
	console.log("navbar ", selectedTheme);

	useEffect(() => {
		const storedTheme = localStorage.getItem("themeColor") || selectedTheme;
		document.documentElement.style.setProperty(
			"--navbar-theme-color",
			storedTheme
		);
	}, [selectedTheme]);

	const [isProfileOpen, setProfileOpen] = useState(false);

	const handleProfileClick = () => {
		setProfileOpen(!isProfileOpen);
	};

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
					src={profile}
					alt="Profile"
					className="w-10 h-10 rounded-full cursor-pointer"
					onClick={handleProfileClick}
				/>

				{isProfileOpen && (
					<div className="profile-dropdown show">
						<button className="block w-full px-4 py-2 text-left hover:bg-gray-200">
							Profile
						</button>
						<button className="block w-full px-4 py-2 text-left hover:bg-gray-200">
							Settings
						</button>
						<button
							className="block w-full px-4 py-2 text-left hover:bg-gray-200"
							onClick={() => {
								localStorage.removeItem("token");
								localStorage.removeItem("themeColor");
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
