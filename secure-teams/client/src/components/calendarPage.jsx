import React, { useState } from 'react';
import Navbar from './navbar';
import InformationPanel from './infopanel';
import Sidepanel from './sidepanel';
import CalendarComponent from './calendarComponent'; // Import your calendar component here

const CalendarPage = () => {
    const [showSidePanel, setShowSidePanel] = useState(true);
    const initialTheme = localStorage.getItem('themeColor') || '#68d391';
    const [theme, setTheme] = useState(initialTheme);

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        document.documentElement.style.setProperty('--navbar-theme-color', newTheme);
    };

    return (
        <div>
            <Sidepanel show={showSidePanel} onThemeChange={handleThemeChange} />
            <Navbar selectedTheme={theme} />
            <InformationPanel />
            <div className="flex justify-center items-center">
                <div style={{ marginTop: '30px' }}>
                    <CalendarComponent />
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
