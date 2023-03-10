import {Navigate} from 'react-router';
import {RedirectProps} from '../types';

const Redirect = ({isAuthenticated, children}: RedirectProps) => {
  if (isAuthenticated) return <Navigate to="/dashboard" />;

  return <>{children}</>;
};

export default Redirect;
