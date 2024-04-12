import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/msgportal.css';

const ContactDetailsComponent = ({ receiver, sender }) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Fetch messages when component mounts
        fetchMessages();
        const intervalId = setInterval(fetchMessages, 1500); // Fetch messages every 3 seconds
        return () => clearInterval(intervalId); // Cleanup function to clear the interval
    }, [receiver]); // Include receiver in the dependency array

    const fetchMessages = async () => {
        try {
            // Make API request to fetch messages from sender to receiver
            const response1 = await axios.get("https://secureteams.onrender.com/api/messages", {
                params: { sender: sender, receiver: receiver }
            });

            // Make API request to fetch messages from receiver to sender
            const response2 = await axios.get("https://secureteams.onrender.com/api/messages", {
                params: { sender: receiver, receiver: sender }
            });

            // Determine which response to use based on status and set the messages state accordingly
            if (response1.status === 200 && response2.status === 200) {
                setMessages(response1.data.concat(response2.data)); // Set messages state with fetched messages
                console.log('response1:', response1.data);
                console.log('response2:', response2.data);
            } else if (response1.status === 200) {
                setMessages(response1.data); // Set messages state with fetched messages;
                console.log('response1:', response1.data);
            } else if (response2.status === 200) {
                setMessages(response2.data); // Set messages state with fetched messages
                console.log('response2:', response2.data);
            } else {
                console.error('Failed to fetch messages');
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    return (
        <div>
            <div className="contact-info">
            <h3 className=''>{receiver.split('@')[0]}</h3>
            </div>
            <div className="">
                <div className="">
                    <div className="message-list">
                        {messages
                            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
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
