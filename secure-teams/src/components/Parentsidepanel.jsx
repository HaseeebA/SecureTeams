import React from 'react';
import Sidepanel from './Sidepanel';
import Sidepanel2 from './Sidepanel2';

const ParentComponent = () => {
  return (
    <div className="relative">
      <Sidepanel />
      <Sidepanel2 />
    </div>
  );
};

export default ParentComponent;
