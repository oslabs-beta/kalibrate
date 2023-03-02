import BrokersDisplay from './BrokersDisplay';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Box from '@mui/material/Box';
import {BrokersProps} from './types';

//props takes in the connectedClusterData
const Brokers = ({clusterData, connectedCluster}: BrokersProps) => {
  return (
    <div className="wrapper">
      <div className="brokers-heading">
        <Typography variant="h4">{`${connectedCluster}`}</Typography>
        <Box mt={2} mb={2}>
          <Breadcrumbs>
            <Typography>Brokers</Typography>
          </Breadcrumbs>
        </Box>
      </div>
      <div className="brokers-display">
        <BrokersDisplay clusterData={clusterData} />
      </div>
    </div>
  );
};

export default Brokers;
