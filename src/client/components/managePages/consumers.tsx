import React from 'react';
import ConsumersDisplay from './ConsumersDisplay';
import {Typography} from '@mui/material';
import {ConsumerProps} from './types';

const Consumers = (props: ConsumerProps) => {
  const {groupData} = props;
  // const {groupData, commitOffsets} = props;
  console.log('(CONSUMERS) groupData:', groupData);
  // console.log('(CONSUMERS) commitOffsets:', commitOffsets);
  
  return (
    <div className="wrapper">
      <div className="consumers-heading" data-testid="consumer-1">
        <Typography variant="h6">Consumers List</Typography>
      </div>
      <div className="consumers-display">
        <ConsumersDisplay groupData={groupData} />
      </div>
    </div>
  );
};

export default Consumers;
