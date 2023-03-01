import BrokersDisplay from './BrokersDisplay';
import {Typography} from '@mui/material';
import {BrokersProps} from './types';

//props takes in the connectedClusterData
const Brokers = ({clusterData, connectedCluster}: BrokersProps) => {
  return (
    <div className="wrapper">
      <div className="brokers-heading">
        <Typography variant="h4">{`${connectedCluster}`}</Typography>
        <Typography variant="h8">Brokers List</Typography>
      </div>
      <div className="brokers-display">
        <BrokersDisplay clusterData={clusterData} />
      </div>
    </div>
  );
};

export default Brokers;
