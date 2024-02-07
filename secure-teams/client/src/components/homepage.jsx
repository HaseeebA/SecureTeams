import React from 'react';
import Navbar from './navbar';
import InformationPanel from './infopanel';
import Sidepanel from './sidepanel';

const homepage = () => {
  return (
    <div >
      <Navbar />
      <Sidepanel />
      <InformationPanel/>
    </div>
  );
};

export default homepage;
