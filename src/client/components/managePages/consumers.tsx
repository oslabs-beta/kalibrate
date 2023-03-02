import {Outlet, useParams} from 'react-router-dom';
import {Typography} from '@mui/material';
import {ConsumerProps} from '../../types';

const Consumers = ({connectedCluster, groupData}: ConsumerProps) => {
  const {groupId} = useParams();

  return (
    <div className="wrapper">
      <div className="consumers-heading" data-testid="consumer-1">
        <Typography variant="h4">{`${connectedCluster}`}</Typography>
        <Typography variant="h6">{groupId ? 'Members List' : 'Consumers List'}</Typography>
      </div>
      <div className="consumers-display">
        <Outlet context={{groupData: groupData}} />
      </div>
    </div>
  );
};

export default Consumers;
