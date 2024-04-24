import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/msgportal.css";
import { useSocket } from "../socketProvider.js";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
// console.log("API Base URL", apiBaseUrl);

const ContactDetailsComponent = ({ receiver, sender }) => {
	const [messages, setMessages] = useState([]);
	const messageListRef = useRef(null);

	const socket = useSocket();

	useEffect(() => {
		console.log("momin")
		fetchMessages();
	}, [receiver]); // Include receiver in the dependency array

	const fetchMessages = async () => {
		try {
			const response1 = await axios.get(
				apiBaseUrl + "/message/messages",
				{
					params: { sender: sender, receiver: receiver },
				}
			);
			const response2 = await axios.get(
				apiBaseUrl + "/message/messages",
				{
					params: { sender: receiver, receiver: sender },
				}
			);
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
		console.log("New message:", data);
		if (data.receiver === sender || data.sender === receiver || data.receiver === receiver || data.sender === sender) {
			// fetchMessages();
			setMessages([...messages, data]);
		}
	});

	return (
        <div className="chat-container">
            <div className="contact-info">
                <h3>{receiver.split("@")[0]}</h3>
            </div>
            <div className="message-list" ref={messageListRef}>
                {messages
                    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                    .map((message, index) => (
                        <div
                            key={index}
                            className={`message ${message.sender === receiver ? "received" : "sent"}`}
                        >
                            <p>{message.message}</p>
                        </div>
                    ))}
            </div>
        </div>
    );
	
	
};

export default ContactDetailsComponent;
