import React from 'react';
import Sidepanel from './sidepanel';
import Sidepanel2 from './sidepanel2';

const ParentComponent = () => {
  return (
    <div className="relative">
      <Sidepanel />
      <Sidepanel2 />
    </div>
  );
};

export default ParentComponent;
