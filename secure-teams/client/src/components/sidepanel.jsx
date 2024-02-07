import React from 'react';
import { home, messages, tasks, members, settings, calendar, add, team } from "../images";
import '../styles/side.css';
import { Link } from 'react-router-dom';

const Sidepanel = ({ show }) => {
    return (
        <div className={`side-panel ${show ? 'visible' : ''}`}>
            <div className="flex items-center mb-9 cursor-pointer">
                <Link to="/homepage" className="home-link">
                <img src={home} alt="Home Icon" />
                <span>Home</span>
                </Link>
            </div>
            <div className="flex items-center mb-9 cursor-pointer">
                <img src={messages} alt="Messages Icon" />
                <span>Messages</span>
            </div>
            <div className="flex items-center mb-9 cursor-pointer">
                <img src={tasks} alt="Tasks Icon" />
                <span>Tasks</span>
            </div>
            <div className="flex items-center mb-9 cursor-pointer">
                <img src={members} alt="Members Icon" />
                <span>Members</span>
            </div>
            <div className="flex items-center mb-9 cursor-pointer">
                <img src={settings} alt="Settings Icon" />
                <span>Settings</span>
            </div>
            <div className="flex items-center mb-9 cursor-pointer">
                <img src={calendar} alt="Calendar Icon" />
                <span>Calendar</span>
            </div>
            <div className="flex items-center mb-9 cursor-pointer">
                <img src={add} alt="Project Icon" />
                <span>My Projects</span>
            </div>
            <div className="team-section">
                <Link to="/team" className="team-link">
                    <img src={team} alt="Team" />
                    <span>Our Team</span>
                </Link>
            </div>
        </div>
    );
};

export default Sidepanel;
