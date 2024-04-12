import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/msgportal.css";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
// console.log("API Base URL", apiBaseUrl);

const ContactDetailsComponent = ({ receiver, sender }) => {
	const [messages, setMessages] = useState([]);
	const messageListRef = useRef(null);
	useEffect(() => {
		// Fetch messages when component mounts
		fetchMessages();
		const intervalId = setInterval(fetchMessages, 1500); // Fetch messages every 3 seconds
		return () => clearInterval(intervalId); // Cleanup function to clear the interval
	}, [receiver]); // Include receiver in the dependency array

	useEffect(() => {
		scrollToBottom();
	}, [messages]); // Scroll to bottom whenever messages change

	const fetchMessages = async () => {
		try {
			// Make API request to fetch messages from sender to receiver
			const response1 = await axios.get(
				// "https://secureteams.onrender.com/api/messages",
				apiBaseUrl + "/messages",
				{
					params: { sender: sender, receiver: receiver },
				}
			);

			// Make API request to fetch messages from receiver to sender
			const response2 = await axios.get(
				// "https://secureteams.onrender.com/api/messages",
				// {
				// 	params: { sender: receiver, receiver: sender },
				// }
				apiBaseUrl + "/messages",
				{
					params: { sender: receiver, receiver: sender },
				}
			);

			// Determine which response to use based on status and set the messages state accordingly
			if (response1.status === 200 && response2.status === 200) {
				setMessages(response1.data.concat(response2.data)); // Set messages state with fetched messages
			} else if (response1.status === 200) {
				setMessages(response1.data); // Set messages state with fetched messages;
			} else if (response2.status === 200) {
				setMessages(response2.data); // Set messages state with fetched messages
			} else {
				console.error("Failed to fetch messages");
			}
		} catch (error) {
			console.error("Error fetching messages:", error);
		}
	};

	const scrollToBottom = () => {
		if (messageListRef.current) {
			messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
		}
	};

	return (
		<div>
			<div className="contact-info">
				<h3 className="">{receiver.split("@")[0]}</h3>
			</div>
			<div className="message-list">
				{messages
					.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
					.map((message, index) => (
						<div
							key={index}
							className={`message ${
								message.sender === receiver ? "received" : "sent"
							}`}
						>
							<p>{message.message}</p>
						</div>
					))}
			</div>
		</div>
	);
};

export default ContactDetailsComponent;
