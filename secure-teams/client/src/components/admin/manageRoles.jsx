import React, { useState } from "react";
import Navbar from "../navbar";
import InformationPanel from "../infopanel";
import Sidepanel from "../sidepanel";
import AssignRolesPage from "./AssignRolesPage";
import EditRolesPage from "./EditRolesPage";

const Roles = () => {
	const [showSidePanel, setShowSidePanel] = useState(true);
	const initialTheme = localStorage.getItem("themeColor");
	const [theme, setTheme] = useState(initialTheme);
	const [activeTab, setActiveTab] = useState("assign");

	const handleThemeChange = (newTheme) => {
		setTheme(newTheme);
		document.documentElement.style.setProperty(
			"--navbar-theme-color",
			newTheme
		);
	};

	return (
		<div>
			<Navbar selectedTheme={theme} />
			<Sidepanel show={showSidePanel} onThemeChange={handleThemeChange} />
			{/* <InformationPanel /> */}
			<div className="flex-2 p-7 ml-60 mr-60">
				<div
					className="bg-gray-200 rounded-lg pt-12 pb-12 pl-8 pr-8"
					style={{ backgroundColor: theme }}
				>
					<div className="tabs flex justify-left items-left mb-4 pl-10">
						<button
							className={`tab-btn ${
								activeTab === "assign" ? "active" : ""
							} bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-3 rounded focus:outline-none focus:shadow-outline`}
							onClick={() => setActiveTab("assign")}
							style={{ backgroundColor: "white", color: "black" }}
						>
							Assign Roles
						</button>
						<button
							className={`tab-btn ${
								activeTab === "edit" ? "active" : ""
							} bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
							onClick={() => setActiveTab("edit")}
							style={{ backgroundColor: "white", color: "black" }}
						>
							Edit Roles
						</button>
					</div>
					{activeTab === "assign" && <AssignRolesPage />}
					{activeTab === "edit" && <EditRolesPage />}
				</div>
			</div>
		</div>
	);
};

export default Roles;
