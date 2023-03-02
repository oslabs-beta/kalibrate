import {Outlet, useParams} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Box from '@mui/material/Box';
import {ConsumerProps} from '../../types';

const Consumers = ({connectedCluster, groupData}: ConsumerProps) => {
  const {groupId} = useParams();

  return (
    <div className="wrapper">
      <div className="consumers-heading" data-testid="consumer-1">
        <Typography variant="h4">{`${connectedCluster}`}</Typography>
        <Box mt={2} mb={2}>
          <Breadcrumbs>
            <Typography>{groupId ? 'Members List' : 'Consumers'}</Typography>
          </Breadcrumbs>
        </Box>
      </div>
      <div className="consumers-display">
        <Outlet context={{groupData: groupData}} />
      </div>
    </div>
  );
};

export default Consumers;
