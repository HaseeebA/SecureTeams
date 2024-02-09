import React, { useState } from 'react';
import Navbar from './navbar';
import TeamInfo from './teaminfo';
import Sidepanel from './sidepanel';

const Team = () => {

  const [showSidePanel, setShowSidePanel] = useState(true);
  const initialTheme = localStorage.getItem('themeColor');
  const [theme, setTheme] = useState(initialTheme);

  const handleThemeChange = (newTheme) => {
      setTheme(newTheme);
      document.documentElement.style.setProperty('--navbar-theme-color', newTheme);
      console.log('homepage theme:', newTheme);
  };

  return (
    <div >
      <Sidepanel show={showSidePanel} onThemeChange={handleThemeChange}/>
      <Navbar selectedTheme={theme}/>
      <TeamInfo />
    </div>
  );
};

export default Team;
