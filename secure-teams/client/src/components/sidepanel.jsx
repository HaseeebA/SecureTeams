import React from 'react';
import { home, messages, tasks, members, settings, calendar } from "../images";
import '../styles/side.css';

const Sidepanel = ({ show }) => {
    return (
        <div className={`relative left-0 top-10% w-60 h-2/5 bg-purple-500 p-4 text-white side-panel ${show ? 'visible' : ''}`}>
            <div className="flex items-center mb-9 cursor-pointer hover:text-orange-500">
                <img src={home} alt="Home Icon" className="w-6 h-6 mr-2" />
                <span className="ml-2">Home</span>
            </div>
            <div className="flex items-center mb-9 cursor-pointer hover:text-orange-500">
                <img src={messages} alt="Messages Icon" className="w-6 h-6 mr-2" />
                <span className="ml-2">Messages</span>
            </div>
            <div className="flex items-center mb-9 cursor-pointer hover:text-orange-500">
                <img src={tasks} alt="Tasks Icon" className="w-6 h-6 mr-2" />
                <span className="ml-2">Tasks</span>
            </div>
            <div className="flex items-center mb-9 cursor-pointer hover:text-orange-500">
                <img src={members} alt="Members Icon" className="w-6 h-6 mr-2" />
                <span className="ml-2">Members</span>
            </div>
            <div className="flex items-center mb-9 cursor-pointer hover:text-orange-500">
                <img src={settings} alt="Settings Icon" className="w-6 h-6 mr-2" />
                <span className="ml-2">Settings</span>
            </div>
            <div className="flex items-center mb-9 cursor-pointer hover:text-orange-500">
                <img src={calendar} alt="Calendar Icon" className="w-6 h-6 mr-2" />
                <span className="ml-2">Calendar</span>
            </div>
        </div>
    );
};

export default Sidepanel;
