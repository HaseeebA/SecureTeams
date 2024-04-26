import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import "../../styles/dashboard.css";
import { useSocket } from "../../socketProvider.js";

const Dashboard = () => {
	const [activityLog, setActivityLog] = useState([]);

	const socket = useSocket();

	useEffect(() => {
		const handleLogMessage = (data) => {
			console.log("Received log message:", data);
			setActivityLog((prevLog) => [...prevLog, data]);
		};

		socket.on("logMessage", handleLogMessage);

		return () => {
			socket.off();
		};
	}, []);

	return (
		<div className="flex">
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
		</div>
	);
};

export default Dashboard;
