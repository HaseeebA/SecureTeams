import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import InformationPanel from './infopanel';
import Sidepanel from './sidepanel';
import axios from "axios";
import ContactDetailsComponent from './messagePortal';
import '../styles/messages.css';

const Messages = () => {
    const email = localStorage.getItem('email');
    const [selectedContact, setSelectedContact] = useState(''); // Selected contact for sending messages
    const [message, setMessage] = useState(''); // Message to be sent
    const [showSidePanel, setShowSidePanel] = useState(true);
    const initialTheme = localStorage.getItem('themeColor');
    const [theme, setTheme] = useState(initialTheme);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [contacts, setContacts] = useState([]);
    const [showComponent, setShowComponent] = useState(false);


    useEffect(() => {
        // Fetch contacts from the server when the component mounts
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            // Make a GET request to fetch the contacts
            console.log(email);
            const response = await axios.get("http://localhost:3000/api/contacts", {
                params: { email: email } // Pass the email as a query parameter
            });
            if (response.status === 200) {
                // If the request is successful, extract the array of emails from the response data
                const data = response.data;
                console.log('dataaaaa:', data);
                const emailsArray = data;
                // const emailsArray = data[2]; // Access the array of emails at the third index
                // Set the contacts state with the extracted array
                setContacts(emailsArray);
            } else {
                // If the request fails, log the error
                console.error("Failed to fetch contacts");
            }
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    };

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        document.documentElement.style.setProperty('--navbar-theme-color', newTheme);
        // console.log('homepage theme:', newTheme);
    };

    const handleAddContact = () => {
        setIsModalOpen(true);
    };

    const handleEmailInputChange = (e) => {
        setEmailInput(e.target.value);
    };

    const handleAddContactConfirm = async () => {
        try {
            // Make POST request to the server's /api/contacts endpoint
            const response = await axios.post("http://localhost:3000/api/contacts", {
                email: email, // Pass the user ID
                contact: emailInput // Pass the contact
            });

            // Check if the request was successful
            if (response.status === 201) {
                console.log('Contact added successfully');
                // Close the modal
                setIsModalOpen(false);
            } else {
                // Handle error response
                const data = await response.json();
                console.log('Error:', data.message);
                // Optionally, display an error message to the user
            }
        } catch (error) {
            console.log('Error adding contact:', error);
            console.error('Error:', error);
            // Handle network error or other issues
        }
    };

    const handleContactClick = (contact) => {
        // Set the selected contact state when a contact is clicked
        setSelectedContact(contact);
        // Show the component when a contact is clicked
        setShowComponent(true);
        // setShowComponent(false);
    };

    const handleSendMessage = async () => {
        // Implement logic to send message to selected contact
        // This can include sending the message content to the backend and storing it in the database
        try {
            // console.log(message);
            // Make POST request to the server's /api/messages endpoint
            const response = await axios.post("http://localhost:3000/api/messages", {
                sender: email, // Pass the user ID
                receiver: selectedContact, // Pass the contact
                message: message // Pass the message content
            });
            // Check if the request was successful
            if (response.status === 201) {
                console.log('Message sent successfully');
                // Clear the message input field
                setMessage('');
                // Optionally, display a success message to the user
            } else {
                // Handle error response
                const data = response.json();
                console.log('Error:', data.message);
                // Optionally, display an error message to the user
            }
        }
        catch (error) {
            console.log('Error sending message:', error);
            console.error('Error:', error);
            // Handle network error or other issues
        }
    };

    const handleKeyPress = (event) => {
        // Check if Enter key is pressed (key code 13) and shift key is not pressed
        if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault(); // Prevent default behavior (creating new line)
            handleSendMessage(); // Call the function to send the message
            // clear message input field
            setMessage('');
        }
    };

    return (
        <div className="flex flex-col h-screen relative"> {/* Added relative positioning */}
            <Sidepanel show={showSidePanel} onThemeChange={handleThemeChange} />
            <Navbar selectedTheme={theme} />
            <InformationPanel />
            <div className="bg-white flex-grow p-7 ml-60 relative"> {/* Make this div flexible and allow it to grow, added relative positioning */}
                <div className="bg-gray-200 rounded-lg p-2 h-full relative flex flex-col justify-end">
                    <div className="transform bg-purple flex justify-between h-full"> {/* Removed absolute positioning */}
                        <div className="h-full relative overflow-y-auto p-4 w-1/6 pr-4 rounded px-4"> {/* Added overflow property */}
                            <button className="bg-blue-400 text-white px-4 py-3 rounded hover:bg-blue-600 flex items-center" onClick={handleAddContact}>
                                Add Contact
                            </button>
                            {isModalOpen && (
                                <div>
                                    <div >
                                        <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                                        <input type="text" value={emailInput} onChange={handleEmailInputChange} placeholder="Enter email" />
                                        <button onClick={handleAddContactConfirm} className='text-white'>Add</button>
                                    </div>
                                </div>
                            )}

                            <div>
                                {/* Display the list of contacts */}
                                <div>
                                    {contacts ? (
                                        contacts.map((contact, index) => (
                                            <div key={index} className="contact-item">
                                                <button className="contact-button" onClick={() => handleContactClick(contact)}>{contact}</button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="contact-item">No contacts available</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    {showComponent && (
                        <div className="modal">
                            <div className="modal-content flex-grow flex flex-col">
                                <ContactDetailsComponent receiver={selectedContact} sender={email} />
                            </div>
                        </div>
                    )}
                    </div>
                    <div className="transform bg-orange-2 flex justify-end"> {/* Removed absolute positioning */}
                        <textarea
                            className="w-full h-1/8 p-2 mb-4 border border-gray-300 rounded px-4"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyPress} // Add key press event listener
                            placeholder="Type your message and press Enter to send"
                            style={{ margin: "10px" }}
                        />
                        <button
                            className="bg-blue-400 text-white px-4 py-3 rounded hover:bg-blue-600 flex items-center"
                            onClick={handleSendMessage}
                            style={{ marginLeft: "10px", marginBottom: "1px" }}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>

        </div >

    );
};

export default Messages;
