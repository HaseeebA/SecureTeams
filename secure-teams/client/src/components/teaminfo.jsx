import React, { useState } from "react";
import { mk, maha, anas, gilani, haseeb } from "../images/index";
import '../styles/teaminfo.css';

const teamMembers = [
    { img: mk, name: "Momin Kashif", contact: "923458253935" },
    { img: anas, name: "Anas Sohail", contact: "923001234567" },
    { img: gilani, name: "SM Gilani", contact: "923112345678" },
    { img: maha, name: "Maha Humayun", contact: "923223456789" },
    { img: haseeb, name: "Haseeb Asad", contact: "923334567890" },
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
                <h1 className="text-white">Meet Our Team</h1>
                <div className="team-member-container">
                    <div className="team-member">
                        <img src={teamMembers[currentIndex].img} alt={teamMembers[currentIndex].name} />
                        <span>{teamMembers[currentIndex].name}</span>
                        <a href={`https://wa.me/${teamMembers[currentIndex].contact}`}
                           className="whatsapp-contact-link"
                           target="_blank"
                           rel="noopener noreferrer">
                            Contact on WhatsApp
                        </a>
                    </div>
                    <button className="carousel-button next" onClick={() => moveCarousel(1)}>&gt;</button>
                </div>
            </div>
        </div>
    );
};

export default TeamInfo;
