import BrokersDisplay from './BrokersDisplay';
import {Typography} from '@mui/material';

// appropriate props should be passed down to brokers display
const Brokers = props => {
  return (
    <div className="wrapper">
      <div className="brokers-heading">
        <Typography variant="h6">Brokers List</Typography>
      </div>
      <div className="brokers-display">
        <BrokersDisplay />
      </div>
    </div>
  );
};

export default Brokers;
