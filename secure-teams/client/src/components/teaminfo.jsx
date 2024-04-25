import React, { useState } from "react";
import { mk, maha, anas, gilani, haseeb } from "../images/index";
import '../styles/teaminfo.css';

const teamMembers = [
  { img: mk, name: "Momin Kashif" },
  { img: anas, name: "Anas Sohail" },
  { img: gilani, name: "SM Gilani" },
  { img: maha, name: "Maha Humayun" },
  { img: haseeb, name: "Haseeb Asad" },
];

const TeamInfo = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const moveCarousel = (direction) => {
        setCurrentIndex((prevIndex) => {
            const newIndex = prevIndex + direction;
            if (newIndex < 0) {
                return teamMembers.length - 1;
            } else if (newIndex >= teamMembers.length) {
                return 0;
            } else {
                return newIndex;
            }
        });
    };

    return (
        <div className="team-carousel-container">
            <div className="team-info">
                <h1>Meet Our Team</h1>
                <div className="team-member-container">
                    <div className="team-member">
                        <img src={teamMembers[currentIndex].img} alt={teamMembers[currentIndex].name} />
                        <span>{teamMembers[currentIndex].name}</span>
                    </div>
                    <button className="carousel-button next" onClick={() => moveCarousel(1)}>&gt;</button>
                </div>
            </div>
        </div>
    );
};

export default TeamInfo;
