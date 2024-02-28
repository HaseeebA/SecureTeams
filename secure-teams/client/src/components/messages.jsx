import React, { useState } from 'react';
import Navbar from './navbar';
import InformationPanel from './infopanel';
import Sidepanel from './messagessidepanel';

const Messages = () => {
    const [contacts, setContacts] = useState([]); // Array to store contacts
    const [selectedContact, setSelectedContact] = useState(''); // Selected contact for sending messages
    const [message, setMessage] = useState(''); // Message to be sent
    const [showSidePanel, setShowSidePanel] = useState(true);
    const initialTheme = localStorage.getItem('themeColor');
    const [theme, setTheme] = useState(initialTheme);

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        document.documentElement.style.setProperty('--navbar-theme-color', newTheme);
        console.log('homepage theme:', newTheme);
    };

    const handleAddContact = () => {
        // Implement logic to add contact by username
        // This can include fetching user details from the backend using the provided username
        // Once user details are fetched, add them to the contacts array
    };

    const handleSendMessage = () => {
        // Implement logic to send message to selected contact
        // This can include sending the message content to the backend and storing it in the database
    };

    const handleKeyPress = (event) => {
        // Check if Enter key is pressed (key code 13) and shift key is not pressed
        if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault(); // Prevent default behavior (creating new line)
            handleSendMessage(); // Call the function to send the message
        }
    };
    

    return (
        <div className="flex flex-col h-screen">
            <Sidepanel show={showSidePanel} onThemeChange={handleThemeChange} />
            <Navbar selectedTheme={theme} />
            <InformationPanel />

            {/* Messaging Section
            <div className="flex-grow flex flex-col justify-center items-center">
                <div className="container mx-auto">
                    <h2 className="text-lg font-semibold mb-4">Contacts</h2>
                    <ul>
                        {contacts.map(contact => (
                            <li key={contact.id}>{contact.name}</li>
                        ))}
                    </ul>
                    <input
                        type="text"
                        value={selectedContact}
                        onChange={(e) => setSelectedContact(e.target.value)}
                        placeholder="Enter username"
                    />
                    <button onClick={handleAddContact}>Add Contact</button>
                </div>
            </div> */}
            <div className="mt-auto">
                <div className="message-composer transform bg-purple p-4 flex justify-between items-center pl-64">
                    <textarea
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress} // Add key press event listener
                        placeholder="Type your message and press Enter to send"
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600"
                        onClick={handleSendMessage}
                    >
                        Send
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Messages;
