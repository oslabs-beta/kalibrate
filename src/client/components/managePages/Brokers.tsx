import BrokersDisplay from './BrokersDisplay';
import {Typography} from '@mui/material';

//props takes in the connectedClusterData
const Brokers = props => {
  const {clusterId, data, connectedCluster} = props;
  console.log('Passing to brokers display', props.data);
  return (
    <div className="wrapper">
      <div className="brokers-heading">
        <Typography variant="h4">{`${connectedCluster}`}</Typography>
        <Typography variant="h8">Brokers List</Typography>
      </div>
      <div className="brokers-display">
        <Typography>{clusterId}</Typography>
        <BrokersDisplay data={data} />
      </div>
    </div>
  );
};

export default Brokers;
