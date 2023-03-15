import {Navigate} from 'react-router';
import {ConnectedProps} from '../types';

const Connected = ({connectedClient, children}: ConnectedProps) => {
  // const navigate = useNavigate();

  // verify whether there is a connected client
  if (!connectedClient) return <Navigate to="/dashboard" />;

  return <>{children}</>;
};

export default Connected;
