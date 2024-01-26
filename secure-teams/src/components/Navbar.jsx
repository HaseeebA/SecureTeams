import React, { useState } from 'react';
import '../index.css';
import face from '../images/face.png';
import profile from '../images/q.png';
import menu from '../images/menu.png';

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex justify-between items-center bg-purple-900 p-4 relative">
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
            <div className="bg-gradient-to-b from-purple-200 to-purple-800 p-2 rounded shadow mt-1">
              <div className="text-white">Option 1</div>
              <div className="text-white">Option 2</div>
              <div className="text-white">Option 3</div>
            </div>
          </div>
        )}

        <img
          src={profile}
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </div>
  );
};

export default Navbar;
