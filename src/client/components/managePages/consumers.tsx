import React from 'react';
import ConsumersDisplay from './ConsumersDisplay';
import {Typography} from '@mui/material';

//WILL RETURN ERROR BC PROPS.DATA=[]
const Consumers = props => {
  console.log('Passing consumers data through...', props.data);
  return (
    <div className="wrapper">
      <div className="consumers-heading" data-testid="consumer-1">
        <Typography variant="h6">Consumers List</Typography>
      </div>
      <div className="consumers-display">
        <ConsumersDisplay consumerProps={props.data} />
      </div>
    </div>
  );
};

export default Consumers;
