import React, { useState } from 'react';
import TeamInfo from './teaminfo';

const Team = () => {
  const initialTheme = localStorage.getItem('themeColor');
  const [theme, setTheme] = useState(initialTheme);

  const handleThemeChange = (newTheme) => {
      setTheme(newTheme);
      document.documentElement.style.setProperty('--navbar-theme-color', newTheme);
      console.log('homepage theme:', newTheme);
  };

  return (
    <div >
      <TeamInfo />
    </div>
  );
};

export default Team;
