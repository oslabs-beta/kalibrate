import ConsumersDisplay from './consumersDisplay';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Box from '@mui/material/Box';
import {ConsumerProps} from '../../types';

const Consumers = (props: ConsumerProps) => {
  const {groupData, connectedCluster} = props;

  return (
    <div className="wrapper">
      <div className="consumers-heading" data-testid="consumer-1">
        <Typography variant="h4">{`${connectedCluster}`}</Typography>
        <Box mt={2} mb={2}>
          <Breadcrumbs>
            <Typography>Consumers</Typography>
          </Breadcrumbs>
        </Box>
      </div>
      <div className="consumers-display">
        <ConsumersDisplay groupData={groupData} />
      </div>
    </div>
  );
};

export default Consumers;
