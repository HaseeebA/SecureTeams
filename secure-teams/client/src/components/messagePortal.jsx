import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/msgportal.css";
import { useSocket } from "../socketProvider.js";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
// console.log("API Base URL", apiBaseUrl);

const ContactDetailsComponent = ({ receiver, sender , receiverName }) => {
	const [messages, setMessages] = useState([]);
	const messageListRef = useRef(null);

	const socket = useSocket();

	const [messages2, setMessages2] = useState([]);
	useEffect(() => {
		fetchMessages();
	}, [receiver]); // Include receiver in the dependency array

	useEffect(() => {
		scrollToBottom();
	}, [messages]); // Scroll to bottom whenever messages change

	const fetchMessages = async () => {
		try {
			const response1 = await axios.get(apiBaseUrl + "/message/messages", {
				params: { sender: sender, receiver: receiver },
			});
			const response2 = await axios.get(apiBaseUrl + "/message/messages", {
				params: { sender: receiver, receiver: sender },
			});

			if (response1.status === 200 && response2.status === 200) {
				const combinedMessages = response1.data.concat(response2.data);
				setMessages(combinedMessages); // Set messages state with fetched messages
			} else if (response1.status === 200) {
				setMessages(response1.data); // Set messages state with fetched messages
			} else if (response2.status === 200) {
				setMessages(response2.data); // Set messages state with fetched messages
			} else {
				console.error("Failed to fetch messages");
			}
		} catch (error) {
			console.error("Error fetching messages:", error);
		}
	};

	socket.on("newMessage", (data) => {
		if (
			(data.receiver === sender && data.sender === receiver) ||
			(data.receiver === receiver && data.sender === sender)
		) {
			setMessages([...messages, data]);
		}
	});

	const scrollToBottom = () => {
		if (messageListRef.current) {
			messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
		}
	};

	return (
		<div className="chat-container">
			<div className="contact-info" style={{ marginBottom: "10px" }}>
				<h3
					style={{
						color: "black",
						fontWeight: "bold",
						fontSize: "20px",
						textTransform: "capitalize",
					}}
				>
					{receiverName}
				</h3>
			</div>
			<div className="message-list" ref={messageListRef}>
				{messages
					.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
					.map((message, index) => (
						<div
							key={index}
							className={`message ${
								message.sender === receiver ? "received" : "sent"
							}`}
						>
							<p style={{ color: "white", marginBottom: "0", padding: "5px" }}>
								{message.message}
							</p>
							<p
								style={{
									color: "white",
									fontSize: "9px",
									marginTop: "0",
									paddingLeft: "5px",
									paddingRight: "5px",
								}}
							>
								{new Date(message.timestamp).toLocaleTimeString()}
							</p>
						</div>
					))}
			</div>
		</div>
	);
};

export default ContactDetailsComponent;
