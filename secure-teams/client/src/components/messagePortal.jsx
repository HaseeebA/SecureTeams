import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactDetailsComponent = ({ receiver, sender }) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Fetch messages when component mounts
        fetchMessages();
        const intervalId = setInterval(fetchMessages, 3000); // Fetch messages every second
        return () => clearInterval(intervalId); // Cleanup function to clear the interval
    }, [receiver]); // Empty dependency array to fetch messages only once when component mounts

    const fetchMessages = async () => {
        try {
            // Make API request to fetch messages
            const response = await axios.get("http://localhost:3000/api/messages", {
                params: { sender: sender, receiver: receiver } // Pass the email as a query parameter
            });
            console.log('response:', response);
            const response2 = await axios.get("http://localhost:3000/api/messages", {
                params: { sender: receiver, receiver: sender } // Pass the email as a query parameter
            });
            if (response.status === 200) {
                setMessages(response.data); // Set messages state with fetched messages
            }
            else if (response2.status === 200) {
                setMessages(response2.data); // Set messages state with fetched messages
            } 
            else {
                console.error('Failed to fetch messages');
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    return (
        <div>
            <div className="contact-info">
                <h3>{receiver}</h3>
            </div>
            <div className="message-panel-container">
                <div className="message-panel">
                    <h2>Messages</h2>
                    <div className="message-list">
                        {messages
                            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) // Sort messages by timestamp
                            .map((message, index) => (
                                <div
                                    key={index}
                                    className={`message ${message.sender === receiver ? 'received' : 'sent'}`}
                                >
                                    <p>{message.message}</p>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
    

};

export default ContactDetailsComponent;
