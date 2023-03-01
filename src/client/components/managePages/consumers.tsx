import React from 'react';
import ConsumersDisplay from './ConsumersDisplay';
import {Typography} from '@mui/material';
import {ConsumerProps} from './types';

const Consumers = (props: ConsumerProps) => {
  const {groupData, connectedCluster} = props;
  console.log('(CONSUMERS) groupData:', groupData);

  return (
    <div className="wrapper">
      <div className="consumers-heading" data-testid="consumer-1">
        <Typography variant="h4">{`${connectedCluster}`}</Typography>
        <Typography variant="h8">Consumers List</Typography>
      </div>
      <div className="consumers-display">
        <ConsumersDisplay groupData={groupData} />
      </div>
    </div>
  );
};

export default Consumers;
