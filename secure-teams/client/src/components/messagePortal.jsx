import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/msgportal.css";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
// console.log("API Base URL", apiBaseUrl);

const ContactDetailsComponent = ({ receiver, sender }) => {
	const [messages, setMessages] = useState([]);
	const messageListRef = useRef(null);
	const [messages2, setMessages2] = useState([]);
	useEffect(() => {
		// Fetch messages when component mounts
		fetchMessages();
		const intervalId = setInterval(fetchMessages, 2000); // Fetch messages every 3 seconds
		return () => clearInterval(intervalId); // Cleanup function to clear the interval
	}, [receiver]); // Include receiver in the dependency array

	// useEffect(() => {
    //     // Scroll to the bottom of the message list
    //     if (messageListRef.current) {
    //         messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    //     }
    // }, [messages2]);

	const getLatestTimestamp = () => {
		// Check if there are any messages
		if (messages.length === 0) {
			// If no messages, return a default timestamp (e.g., the current time)
			return new Date().toISOString(); // Example: returns current time in ISO format
		} else {
			// Get the timestamp of the latest message
			const latestMessage = messages[messages.length - 1]; // Assuming messages are sorted chronologically
			return latestMessage.timestamp; // Assuming each message object has a 'timestamp' property
		}
	};
	
	const [latestTimestamp, setLatestTimestamp] = useState(null);

	const fetchMessages = async () => {
		try {
			// Get the timestamp of the latest message
			const latestTimestamp = getLatestTimestamp(); // Implement this function to retrieve the latest timestamp
	
			// Make API request to fetch newer messages from sender to receiver
			const response1 = await axios.get(apiBaseUrl + "/messages", {
				params: { sender: sender, receiver: receiver, timestamp: latestTimestamp },
			});
	
			// Make API request to fetch newer messages from receiver to sender
			const response2 = await axios.get(apiBaseUrl + "/messages", {
				params: { sender: receiver, receiver: sender, timestamp: latestTimestamp },
			});
	
			// Determine which response to use based on status and update the messages state accordingly
			if (response1.status === 200 && response2.status === 200) {
				const combinedMessages = response1.data.concat(response2.data);
				setMessages(combinedMessages); // Set messages state with fetched messages
				// scrollToBottom(); // Scroll to bottom if there are new messages
			} else if (response1.status === 200) {
				setMessages(response1.data); // Set messages state with fetched messages
				// scrollToBottom(); // Scroll to bottom if there are new messages
			} else if (response2.status === 200) {
				setMessages(response2.data); // Set messages state with fetched messages
				// scrollToBottom(); // Scroll to bottom if there are new messages
			} else {
				console.error("Failed to fetch messages");
			}
			// if (messages2 != messages) {
			// 	setMessages2(messages);
			// }
		} catch (error) {
			console.error("Error fetching messages:", error);
		}
	};
	

	// const scrollToBottom = () => {
	// 	if (messageListRef.current) {
	// 		messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
	// 	}
	// };

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
