import React from 'react';
import ProducersDisplay from './ProducersDisplay';

const Producers = props => {
  return (
    <div className="wrapper">
      <div className="producers-heading">
        <h3>Producers</h3>
        <input type="text" placeholder="Search" />
      </div>
      <div className="producers-display">
        <ProducersDisplay /*producerData={this.props.producerData*/></ProducersDisplay>
      </div>
    </div>
  );
};

export default Producers;
