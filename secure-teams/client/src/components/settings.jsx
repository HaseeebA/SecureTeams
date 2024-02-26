import React, { useState } from 'react';
import Navbar from './navbar';
import Sidepanel from './sidepanel';
import { Link } from 'react-router-dom';
import '../styles/settings.css';
import axios from 'axios';

const Settings = () => {
    const [showSidePanel, setShowSidePanel] = useState(true);
    const initialTheme = localStorage.getItem('themeColor') || '#68d391';
    console.log('initial theme:', initialTheme)
    const [theme, setTheme] = useState(initialTheme);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        document.documentElement.style.setProperty('--navbar-theme-color', newTheme);
        console.log('homepage theme:', newTheme);
    };

    const handleUpdate = async (event) => {
        event.preventDefault(); 

        try {
            const response = await axios.post('http://localhost:3000/api/update', {
                email: email,
                password: password
            });
            console.log(response.data);
        } catch (error) {
            console.error('There was an error updating the email and password', error);
        }
    };

    return (
        <div>
            <Sidepanel show={showSidePanel} onThemeChange={handleThemeChange} />
            <Navbar selectedTheme={theme} />
            
            <div className="settings-container" style={{ left: '250px', right: '250px', top:'250px' }}>
                <h1 className='heading'>Settings</h1>
                <main className="settings-content" style={{ backgroundColor: theme }}>
                    <form className="settings-form" onSubmit={handleUpdate}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your new email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />

                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your new password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />

                        <button type="submit" className='update-button'>Update</button>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default Settings;
