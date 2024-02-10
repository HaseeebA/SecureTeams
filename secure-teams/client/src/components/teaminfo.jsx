import React from "react";
import { mk , maha , anas , gilani , haseeb } from "../images/index";
import '../styles/teaminfo.css';

const TeamInfo = () => {
    return (
        <div className="team-info">
            <h1>Meet Our Team</h1>
            <div className="team-member">
                <img src={mk} alt="Momin Kashif" />
                <span className="text-black font-bold">Momin Kashif</span>
            </div>
            <div className="team-member">
                <img src={anas} alt="Anas" />
                <span className="text-black font-bold">Anas Sohail</span>
            </div>
            <div className="team-member">
                <img src={gilani} alt="Gilani" />
                <span className="text-black font-bold">SM Gilani</span>
            </div>
            <div className="team-member">
                <img src={maha} alt="Maha" />
                <span className="text-black font-bold">Maha Humayun</span>
            </div>
            <div className="team-member">
                <img src={haseeb} alt="Haseeb" />
                <span className="text-black font-bold">Haseeb Asad</span>
            </div>
        </div>
    );
};

export default TeamInfo;
