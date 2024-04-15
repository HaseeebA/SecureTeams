import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import "../../styles/dashboard.css";
import { useSocket } from "../../socketProvider.js";

const Dashboard = () => {
	const [totalUsers, setTotalUsers] = useState(0);
	const [activeUsers, setActiveUsers] = useState(0);
	const [activityLog, setActivityLog] = useState([]);

	const socket = useSocket();

	useEffect(() => {
		// Listen for logMessage event
		const handleLogMessage = (data) => {
			console.log("Received log message:", data);
			setActivityLog((prevLog) => [...prevLog, data]);
		};

		socket.on("logMessage", handleLogMessage);

		return () => {
			socket.off("logMessage", handleLogMessage);
		};
	}, []); // Empty dependency array ensures this effect runs only once

	return (
		<div className="flex">
			{/* Left Section - Activity Console */}
			<div className="console-container">
				<h2 className="text-xl font-bold ml-2">Activity Log</h2>
				<div className="w-1/2 p-4 console">
					<ul>
						{activityLog.map((activity, index) => (
							<li
								key={index}
								dangerouslySetInnerHTML={{ __html: activity }}
							></li>
						))}
					</ul>
				</div>
			</div>

			{/* Right Section - User Statistics */}
			<div className="stats-container">
				<div className="w-1/2 p-4">
					<div className="stats1">
						<h2 className="text-xl font-bold">Total Users: {totalUsers}</h2>
					</div>
					<div className="stats2">
						<h2 className="text-xl font-bold">Active Users: {activeUsers}</h2>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
