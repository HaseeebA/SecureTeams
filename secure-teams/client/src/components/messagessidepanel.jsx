import React, { useState, useEffect } from 'react';
import { home, messages, mk } from "../images";
import '../styles/messages.css';
import { Link } from 'react-router-dom';

const Sidepanel = ({ show, onThemeChange }) => {
    const [themeColor, setThemeColor] = useState(localStorage.getItem('themeColor'));
    const [contacts, setContacts] = useState([]);
    const [newContactUsername, setNewContactUsername] = useState('');

    useEffect(() => {
        document.documentElement.style.setProperty('--side-panel-background-color', themeColor);
        fetchContacts();
    }, [themeColor]);

    const fetchContacts = async () => {
        try {
            // Fetch contacts data from your backend API
            const response = await fetch('/api/contacts');
            if (!response.ok) {
                throw new Error('Failed to fetch contacts');
            }
            const data = await response.json();
            // Set the fetched contacts data to state
            setContacts(data.contacts);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const handleThemeChange = (primaryColor) => {
        setThemeColor(primaryColor);
        onThemeChange(primaryColor);
        localStorage.setItem('themeColor', primaryColor);
    }

    const handleAddContact = async () => {
        try {
            // Send a request to add the new contact using their username
            const response = await fetch('/api/contacts/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: newContactUsername }),
            });
            if (!response.ok) {
                throw new Error('Failed to add contact');
            }
            // Fetch contacts again to update the contacts list with the newly added contact
            fetchContacts();
            // Clear the input field after adding the contact
            setNewContactUsername('');
        } catch (error) {
            console.error('Error adding contact:', error);
        }
    };

    return (
        <div className={`side-panel ${show ? 'visible' : ''}`}>
            <div className="flex items-center mb-9 cursor-pointer">
                <Link to="/homepage" className="home-link">
                    <img src={home} alt="Home Icon" />
                    <span>Home</span>
                </Link>
            </div>
            <div className="messages-tab">  {/* New container */}
                <div className="flex items-center mb-9 cursor-pointer">
                    <img src={mk} alt="Messages Icon" />
                    <span>Contacts</span>
                </div>
            </div>

            <div className="add-contact-panel absolute bottom-0 left-0 w-full p-4">
                <input
                    type="text"
                    value={newContactUsername}
                    onChange={(e) => setNewContactUsername(e.target.value)}
                    placeholder="Enter username"
                    className="border border-gray-300 rounded px-3 py-2 mr-2"
                />
                <button onClick={handleAddContact} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Add Contact
                </button>
            </div>
        </div>
    );
};

export default Sidepanel;
