import BrokersDisplay from './BrokersDisplay';
import {Typography} from '@mui/material';

//props takes in the connectedClusterData
const Brokers = props => {
  console.log('Passing to brokers display', props.data.cluster);
  const {clusterId} = props.data.cluster;
  return (
    <div className="wrapper">
      <div className="brokers-heading">
        <Typography variant="h6">Brokers List</Typography>
      </div>
      <div className="brokers-display">
        <Typography>{clusterId}</Typography>
        <BrokersDisplay data={props.data.cluster} />
      </div>
    </div>
  );
};

export default Brokers;
