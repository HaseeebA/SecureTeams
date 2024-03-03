import React, { useState } from 'react';
import Navbar from './navbar';
import InformationPanel from './infopanel';
import Sidepanel from './sidepanel';

const Homepage = () => {
    const [showSidePanel, setShowSidePanel] = useState(true);
    const initialTheme = localStorage.getItem('themeColor') || '#68d391';
    // console.log('initial theme:', initialTheme)/
    const [theme, setTheme] = useState(initialTheme);

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        document.documentElement.style.setProperty('--navbar-theme-color', newTheme);
        // console.log('homepage theme:', newTheme);
    };

    return (
        <div>
            <Sidepanel show={showSidePanel} onThemeChange={handleThemeChange} />
            <Navbar selectedTheme={theme} />
            <InformationPanel />
            <div className="flex justify-center items-center">
                <h1 className="text-4xl font-bold text-gray-800 mt-10">Welcome to Secure Teams</h1>
            </div>
        </div>
    );
};

export default Homepage;
