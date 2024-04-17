import React, { useState, useEffect } from "react";
import {
	home,
	messages,
	tasks,
	members,
	calendar,
	add,
	team,
	theme,
	rightarrow,
} from "../images";
import "../styles/side.css";
import { Link } from "react-router-dom";

const Sidepanel = ({ show, onThemeChange }) => {
	const [isPanelOpen, setIsPanelOpen] = useState(true);
	const [themeColor, setThemeColor] = useState(
		localStorage.getItem("themeColor")
	);
	const [isThemeOptionsOpen, setIsThemeOptionsOpen] = useState(false);
	const [invertImages, setInvertImages] = useState(false);
	const noHoverColors = ["#0b1623", "#540D0D", "#013220"];

	const togglePanel = () => {
		setIsPanelOpen(!isPanelOpen);
		const newLeftPosition = isPanelOpen ? "25px" : "220px";
		const toggleButton = document.querySelector(".toggle-panel-button");
		if (toggleButton) {
			toggleButton.style.left = newLeftPosition;
		}
	};

	useEffect(() => {
		document.documentElement.style.setProperty(
			"--side-panel-background-color",
			themeColor
		);
		onThemeChange(themeColor);

		const shouldDisableHover = noHoverColors.includes(themeColor);
		if (shouldDisableHover) {
			document.body.classList.add("no-hover");
		} else {
			document.body.classList.remove("no-hover");
		}

		const shouldInvert = noHoverColors.includes(themeColor);
		setInvertImages(shouldInvert);

		localStorage.setItem("themeColor", themeColor);
	}, [themeColor, onThemeChange]);

	const handleThemeChange = (primaryColor) => {
		setThemeColor(primaryColor);
		onThemeChange(primaryColor);
		localStorage.setItem("themeColor", primaryColor);
		setIsThemeOptionsOpen(false);
	};

	const toggleThemeOptions = () => {
		setIsThemeOptionsOpen(!isThemeOptionsOpen);
	};

	const closeThemeOptions = (event) => {
		if (
			isThemeOptionsOpen &&
			!event.target.closest(".theme-options") &&
			!event.target.closest(".change-theme-trigger")
		) {
			setIsThemeOptionsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", closeThemeOptions);
		return () => {
			document.removeEventListener("mousedown", closeThemeOptions);
		};
	}, [isThemeOptionsOpen]);

	const role = localStorage.getItem("role");
	if (role === "admin") {
		return (
			<div
				className={`side-panel ${show ? "visible" : ""} ${
					isPanelOpen ? "expanded" : "collapsed"
				} ${invertImages ? "inverted-images" : ""}`}
			>
				<button onClick={togglePanel} className="toggle-panel-button">
					<img src={rightarrow} alt="Toggle" />
				</button>
				<div className="flex items-center mb-9 cursor-pointer">
					<Link to="/homepage" className="home-link">
						<img src={home} alt="Home Icon" />
						<span>Home</span>
					</Link>
				</div>

				<div className="flex items-center mb-9 cursor-pointer">
					<Link to="/manageRoles" className="home-link">
						<img src={team} alt="Team" />
						<span>Manage Roles</span>
					</Link>
				</div>

				<div
					className="flex items-center mb-9 cursor-pointer relative"
					onClick={toggleThemeOptions}
				>
					<img src={theme} alt="Theme" />
					<span>Change Theme</span>
					{isThemeOptionsOpen && (
						<div className="theme-options absolute bg-white p-2 shadow-md">
							<div
								className="theme-option"
								onClick={() => handleThemeChange("#68d391")}
							>
								Green
							</div>
							<div
								className="theme-option"
								onClick={() => handleThemeChange("#5DADE2")}
							>
								Blue
							</div>
							<div
								className="theme-option"
								onClick={() => handleThemeChange("#d873c9")}
							>
								Pink
							</div>
							<div
								className="theme-option"
								onClick={() => handleThemeChange("#6f6f6f")}
							>
								Grey
							</div>
							<div
								className="theme-option"
								onClick={() => handleThemeChange("#b5c99a")}
							>
								Mint
							</div>
							<div
								className="theme-option"
								onClick={() => handleThemeChange("#9c6644")}
							>
								Brown
							</div>
							<div
								className="theme-option"
								onClick={() => handleThemeChange("#ddb892")}
							>
								Peach
							</div>
							<div
								className="theme-option"
								onClick={() => handleThemeChange("#45dfb1")}
							>
								Neon Green
							</div>
							<div
								className="theme-option"
								onClick={() => handleThemeChange("#0b1623")}
							>
								Midnight Blue
							</div>
							<div
								className="theme-option"
								onClick={() => handleThemeChange("#540D0D")}
							>
								Dark Velvet
							</div>
							<div
								className="theme-option"
								onClick={() => handleThemeChange("#013220")}
							>
								Forest Shadow
							</div>
						</div>
					)}
				</div>
			</div>
		);
	} else {
		return (
			<div
				className={`side-panel ${show ? "visible" : ""} ${
					isPanelOpen ? "expanded" : "collapsed"
				} ${invertImages ? "inverted-images" : ""}`}
			>
				<button onClick={togglePanel} className="toggle-panel-button">
					<img src={rightarrow} alt="Toggle" />
				</button>
				<div className="flex items-center mb-9 cursor-pointer">
					<Link to="/homepage" className="home-link">
						<img src={home} alt="Home Icon" />
						<span>Home</span>
					</Link>
				</div>
				<div className="flex items-center mb-9 cursor-pointer">
					<Link to="/messages" className="messages-link">
						<img src={messages} alt="Messages Icon" />
						<span>Messages</span>
					</Link>
				</div>
				<div className="flex items-center mb-9 cursor-pointer">
					<img src={tasks} alt="Tasks Icon" />
					<Link to="/tasks" className="tasks-link">
						<span>Tasks</span>
					</Link>
				</div>
				<div className="flex items-center mb-9 cursor-pointer">
					<Link to="/members" className="members-link">
						<img src={members} alt="Members Icon" />
						<span>Teams</span>
					</Link>
				</div>
				<div className="flex items-center mb-9 cursor-pointer">
					<Link to="/calendar" className="members-link">
						<img src={calendar} alt="Calendar Icon" />
						<span>Calendar</span>
					</Link>
				</div>
				<div
					className="flex items-center mb-9 cursor-pointer relative"
					onClick={toggleThemeOptions}
				>
					<img src={theme} alt="Theme" />
					<span>Change Theme</span>
					{isThemeOptionsOpen && (
						<div className="theme-options absolute bg-white p-2 shadow-md">
							<div
								className="theme-option"
								onClick={() => handleThemeChange("#68d391")}
							>
								Green
							</div>
							<div
								className="theme-option"
								onClick={() => handleThemeChange("#5DADE2")}
							>
								Blue
							</div>
							<div
								className="theme-option"
								onClick={() => handleThemeChange("#d873c9")}
							>
								Pink
							</div>
							<div
								className="theme-option"
								onClick={() => handleThemeChange("#6f6f6f")}
							>
								Grey
							</div>
							<div
								className="theme-option"
								onClick={() => handleThemeChange("#b5c99a")}
							>
								Mint
							</div>
							<div
								className="theme-option"
								onClick={() => handleThemeChange("#9c6644")}
							>
								Brown
							</div>
							<div
								className="theme-option"
								onClick={() => handleThemeChange("#ddb892")}
							>
								Peach
							</div>
							<div
								className="theme-option"
								onClick={() => handleThemeChange("#45dfb1")}
							>
								Neon Green
							</div>
							<div
								className="theme-option"
								onClick={() => handleThemeChange("#0b1623")}
							>
								Midnight Blue
							</div>
							<div
								className="theme-option"
								onClick={() => handleThemeChange("#540D0D")}
							>
								Dark Velvet
							</div>
							<div
								className="theme-option"
								onClick={() => handleThemeChange("#013220")}
							>
								Forest Shadow
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}
};

export default Sidepanel;
