import React from 'react';
import ConsumersDisplay from './consumersDisplay';

const Consumers = () => {
  return (
    <div className="wrapper">
      <div className="consumers-heading">
        <h3>Consumers</h3>
        <input type="text" placeholder="Search" />
      </div>
      <div className="consumers-display">
        <ConsumersDisplay></ConsumersDisplay>
      </div>
    </div>
  );
};

export default Consumers;
