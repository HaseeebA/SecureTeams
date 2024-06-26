import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "../styles/CalendarComponent.css";

import { useSocket } from "../socketProvider.js";

const CalendarComponent = () => {
	const [date, setDate] = useState(new Date());
	const [events, setEvents] = useState([]);
	const [popupEvents, setPopupEvents] = useState([]);
	const [showPopup, setShowPopup] = useState(false);
	const [newEventTitle, setNewEventTitle] = useState("");
	const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
	const initialTheme = localStorage.getItem("themeColor") || "#ddb892";
	const [theme, setTheme] = useState(initialTheme);

	const handleThemeChange = (newTheme) => {
		setTheme(newTheme);
		document.documentElement.style.setProperty(
			"--navbar-theme-color",
			newTheme
		);
	};

	const socket = useSocket();

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const email = localStorage.getItem("email");
				const response = await fetch(
					apiBaseUrl + "/event/events?email=" + email
				);
				socket.emit("logActivity", {
					method: "GET",
					path: "/event/events?email=" + email,
					email: email,
				});
				if (response.ok) {
					const data = await response.json();
					setEvents(data);
				} else {
					console.error("Failed to fetch events");
				}
			} catch (error) {
				console.error("Error fetching events:", error);
			}
		};

		fetchEvents();
	}, []);

	const isSameDay = (date1, date2) => {
		const d1 = new Date(date1);
		const d2 = new Date(date2);
		return (
			d1.getDate() === d2.getDate() &&
			d1.getMonth() === d2.getMonth() &&
			d1.getFullYear() === d2.getFullYear()
		);
	};

	const handleDateChange = (newDate) => {
		setDate(newDate);
	};

	const handleDeleteEvent = async (eventId) => {
		try {
			const email = localStorage.getItem("email");
			const response = await fetch(
				apiBaseUrl + "/event/delete-event/" + email + "/" + eventId,
				{
					method: "DELETE",
				}
			);
			socket.emit("logActivity", {
				method: "DELETE",
				path: `/event/delete-event/${email}/${eventId}`,
				email: email,
			});

			if (response.ok) {
				window.location.reload();
			} else {
				console.error("Failed to delete event");
			}
		} catch (error) {
			console.error("Error deleting event:", error);
		}
	};

	const handleTileClick = (value) => {
		const clickedDate = new Date(value);
		const eventsOnDate = events.filter((event) => {
			const eventDate = new Date(event.date);
			return isSameDay(eventDate, clickedDate);
		});
		setPopupEvents(eventsOnDate);
		setShowPopup(true);
	};

	const handleClosePopup = () => {
		setShowPopup(false);
	};

	const handleAddEvent = async () => {
		if (newEventTitle.trim() !== "") {
			try {
				const email = localStorage.getItem("email");
				// const response = await fetch("https://secureteams.onrender.com/api/add-event", {
				const response = await fetch(apiBaseUrl + "/event/add-event", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: email,
						title: newEventTitle.trim(),
						date: date,
					}),
				});

				socket.emit("logActivity", {
					method: "POST",
					path: "/event/add-event",
					email: email,
				});

				if (response.ok) {
					window.location.reload();
				} else {
					console.error("Failed to add event");
				}
			} catch (error) {
				console.error("Error adding event:", error);
			}
		}
	};

	const tileContent = ({ date: calendarDate, view }) => {
		const clickedDate = new Date(calendarDate);
		const eventsOnDate = events.filter((event) => {
			const eventDate = new Date(event.date);
			return isSameDay(eventDate, clickedDate);
		});

		const handleTileClick = () => {
			setPopupEvents(eventsOnDate);
			setShowPopup(true);
		};
		const MAX_EVENT_TITLE_LENGTH = 20;
		let exceededEventsCount = 0;

		return (
			<div className="event-box" onClick={handleTileClick}>
				{eventsOnDate.map((event, index) => {
					const eventStyle = {
						backgroundColor: `hsl(${index * 20}, 70%, 80%)`,
					};
					if (event.title.length <= MAX_EVENT_TITLE_LENGTH) {
						return (
							<div key={event.id} className="event-found" style={eventStyle}>
								{event.title}
							</div>
						);
					} else {
						exceededEventsCount++;
						return null;
					}
				})}
				{exceededEventsCount > 0 && (
					<div
						className="exceeded-events-message"
						style={{ backgroundColor: `white` }}
					>
						{`+ ${exceededEventsCount} more`}
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="calendar-container">
			<div className="add-event-section">
				<input
					type="text"
					placeholder="Enter event title"
					value={newEventTitle}
					onChange={(e) => setNewEventTitle(e.target.value)}
				/>
				<button
					onClick={handleAddEvent}
					style={{ backgroundColor: localStorage.getItem("themeColor") }}
				>
					Add Event
				</button>
			</div>
			<Calendar
				onChange={handleDateChange}
				value={date}
				tileContent={tileContent}
			/>
			{showPopup && (
				<div className="event-popup">
					<div className="event-popup-content">
						<h3>Events on this day:</h3>
						<ul>
							{popupEvents.map((event) => (
								<li key={event.id}>
									<div className="event-container">
										<div className="event-title">{event.title}</div>
										<button
											className="delete-button"
											onClick={() => handleDeleteEvent(event.id)}
										>
											Delete
										</button>
									</div>
								</li>
							))}
						</ul>
						<button className="close-button" onClick={handleClosePopup}>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default CalendarComponent;
