import React from 'react';
import Navbar from './navbar';
import ParentComponent from './parentSidePanel';
import InformationPanel from './infopanel';

const homepage = () => {
  return (
    <div >
      <Navbar />
      <ParentComponent/>
      <InformationPanel/>
    </div>
  );
};

export default homepage;
