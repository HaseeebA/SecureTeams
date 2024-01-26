import React from 'react';
import { add} from '../images'; 
import './side.css';

const Sidepanel2 = () => {
    return (
        <div className="relative left-0 top-0 w-60 h-full bg-blue-500 p-4 text-white min-h-screen flex justify-between side-panel ${show ? 'visible' : ''}">
           <span className='text-2xl'>My Projects</span>
           {/* add project here after importing above */}
           <img src={add} alt="Project Icon" className="w-8 h-8" />
        </div>
    );
};

export default Sidepanel2;
