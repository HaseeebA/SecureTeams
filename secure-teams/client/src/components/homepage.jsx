// import React, { useState, useEffect } from "react";
// import Navbar from "./navbar";
// import InformationPanel from "./infopanel";
// import Sidepanel from "./sidepanel";
// import CalendarHomeComponent from "./calendarHomeComponent";
// import Dashboard from "./admin/dashboard";
// import Team from "./team.jsx";
// import RemindersList from './reminders';


// const Homepage = () => {
// 	const defaultTheme = "#68d391";
// 	const [showSidePanel, setShowSidePanel] = useState(true);
// 	const [theme, setTheme] = useState(
// 		localStorage.getItem("themeColor") || defaultTheme
// 	);
// 	const role = localStorage.getItem("role") || "Employee";

// 	// Side effect for initializing theme color
// 	useEffect(() => {
// 		document.documentElement.style.setProperty("--navbar-theme-color", theme);
// 	}, [theme]); // Dependency on theme ensures this runs if theme changes

// 	const handleThemeChange = (newTheme) => {
// 		setTheme(newTheme);
// 		localStorage.setItem("themeColor", newTheme); // Update localStorage with new theme
// 		document.documentElement.style.setProperty(
// 			"--navbar-theme-color",
// 			newTheme
// 		);
// 	};

// 	//const role = localStorage.getItem("role");
// 	if (role === "admin") {
// 		return (
// 			<>
// 			<div>
// 				<Sidepanel show={showSidePanel} onThemeChange={handleThemeChange} />
// 				<Navbar selectedTheme={theme} role={role} />
// 				<InformationPanel />
// 				<div className="ml-10">
// 					<Dashboard />
// 				</div>
// 			</div>
// 			<Team />
// 			</>
// 		);
// 	} else {
// 		return (
// 			<>
// 			<div>
// 				<Sidepanel show={showSidePanel} onThemeChange={handleThemeChange} />
// 				<Navbar selectedTheme={theme} role={role} />
// 				<InformationPanel />
// 				<div className="flex justify-center items-center">
// 					<h1 className="text-4xl font-bold text-gray-800 mt-10">
// 						Welcome to Secure Teams
// 					</h1>
// 				</div>
// 				<div className="ml-10">
// 					<CalendarHomeComponent />
// 				</div>
// 			</div>
// 			<Team />
// 			</>
// 		);
// 	}
// };

// export default Homepage;

import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import InformationPanel from "./infopanel";
import Sidepanel from "./sidepanel";
import CalendarHomeComponent from "./calendarHomeComponent";
import Dashboard from "./admin/dashboard";
import Team from "./team.jsx";
import RemindersList from "./reminders"; 
import "../styles/homepage.css";

const Homepage = () => {
  const defaultTheme = "#68d391";
  const [showSidePanel, setShowSidePanel] = useState(true);
  const [theme, setTheme] = useState(
    localStorage.getItem("themeColor") || defaultTheme
  );
  const role = localStorage.getItem("role") || "Employee";

  // Side effect for initializing theme color
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--navbar-theme-color",
      theme
    );
  }, [theme]); // Dependency on theme ensures this runs if theme changes

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("themeColor", newTheme); // Update localStorage with new theme
    document.documentElement.style.setProperty(
      "--navbar-theme-color",
      newTheme
    );
  };

  //const role = localStorage.getItem("role");
  if (role === "admin") {
    return (
      <>
        <div>
          <Sidepanel show={showSidePanel} onThemeChange={handleThemeChange} />
          <Navbar selectedTheme={theme} role={role} />
          <InformationPanel />
          <div className="ml-10">
            <Dashboard />
          </div>
        </div>
        <Team />

        <div className="reminders-container">
          <RemindersList />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div>
          <Sidepanel show={showSidePanel} onThemeChange={handleThemeChange} />
          <Navbar selectedTheme={theme} role={role} />
          <InformationPanel />
          <div className="flex justify-center items-center">
            <h1 className="text-4xl font-bold text-gray-800 mt-10">
              Welcome to Secure Teams
            </h1>
          </div>
          <div className="ml-10">
            <CalendarHomeComponent />
          </div>
        </div>
        <Team />
        {/* Display RemindersList on the right side */}
        <div className="reminders-container">
          <RemindersList />
        </div>
      </>
    );
  }
};

export default Homepage;
