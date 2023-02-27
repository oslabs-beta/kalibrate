import BrokersDisplay from './BrokersDisplay';
import {Typography} from '@mui/material';

//props takes in the connectedClusterData
const Brokers = props => {
  console.log('Passing to brokers display', props.data);
  const {clusterId} = props;
  return (
    <div className="wrapper">
      <div className="brokers-heading">
        <Typography variant="h6">Brokers List</Typography>
      </div>
      <div className="brokers-display">
        <Typography>{clusterId}</Typography>
        <BrokersDisplay data={props.data} />
      </div>
    </div>
  );
};

export default Brokers;
