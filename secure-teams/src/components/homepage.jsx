import React from 'react';
import Navbar from './Navbar';
import ParentComponent from './Parentsidepanel';
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
