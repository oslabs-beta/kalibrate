import React from 'react';
import ProducersDisplay from './ProducersDisplay';
import {Typography} from '@mui/material';

//WILL RETURN ERROR BC PROPS.DATA=[]
const Producers = props => {
  console.log('Passing producers data through...', props.data);
  return (
    <div className="wrapper">
      <div className="producers-heading">
        <Typography variant="h6">Producers List</Typography>
      </div>
      <div className="producers-display">
        <ProducersDisplay producerProps={props.data} />
      </div>
    </div>
  );
};

export default Producers;
