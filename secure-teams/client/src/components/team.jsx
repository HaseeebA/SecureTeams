import React from 'react';
import Navbar from './navbar';
import TeamInfo from './teaminfo';
import Sidepanel from './sidepanel';

const team = () => {
  return (
    <div >
      <Navbar />
      <Sidepanel />
      <TeamInfo />
    </div>
  );
};

export default team;
