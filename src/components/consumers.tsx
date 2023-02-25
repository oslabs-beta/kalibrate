import React from 'react';
import ConsumersDisplay from './ConsumersDisplay';

const Consumers = props => {
  return (
    <div className="wrapper">
      <div className="consumers-heading" data-testid="consumer-1">
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
