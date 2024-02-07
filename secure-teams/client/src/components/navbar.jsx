import React, { useState } from 'react';
import '../index.css'; 
import face from '../images/face.png';
import profile from '../images/q.png';
import menu from '../images/menu.png';
import '../styles/navbar.css';

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);

  const handleMenuClick = () => {
    setMenuOpen(!isMenuOpen);
  };
  const handleProfileClick = () => {
    setProfileOpen(!isProfileOpen);
  };

  return (
    <div className="navbar">
      <div className="flex items-center">
        <img
          src={face}
          alt="Icon"
          className="w-10 h-10 mr-2 rounded-full"
        />
      </div>

      <div className="flex-1 text-center">
        <input
          type="text"
          placeholder="Search"
          className="border p-2 rounded-md w-full max-w-xs mx-auto"
        />
      </div>

      <div className="flex items-center relative">
        <img
          src={menu}
          alt="Menu"
          className="w-6 h-6 mr-4 cursor-pointer transition-transform transform hover:scale-110"
          onClick={handleMenuClick}
        />

        {isMenuOpen && (
          <div className="absolute top-full right-7">
            <div className="bg-gradient-to-b from-green-200 to-green-800 p-2 rounded shadow mt-1">
              <span>Option 1</span>
              <span>Option 2</span>
              <span>Option 3</span>
            </div>
          </div>
        )}

        <img
          src={profile}
          alt="Profile"
          className="w-8 h-8 rounded-full"
          onClick={handleProfileClick}
        />

        {isProfileOpen && (
          <div className="relative">
            <div className="bg-gradient-to-b from-green-200 to-green-800 p-2 rounded shadow mt-1">
              <button className="text-white hover:text-purple-500">
                Profile
              </button>
              <button className="text-white hover:text-purple-500">
                Settings
              </button>
              <button
                className="text-white hover:text-purple-500"
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
