import React from 'react';
import ProducersDisplay from './ProducersDisplay';
import {Typography} from '@mui/material';

const Producers = () => {
  return (
    <div className="wrapper">
      <div className="producers-heading">
        <Typography variant="h6">Producers List</Typography>
      </div>
      <div className="producers-display">
        <ProducersDisplay /*producerData={this.props.producerData*/></ProducersDisplay>
      </div>
    </div>
  );
};

export default Producers;
