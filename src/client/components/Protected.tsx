import {Navigate} from 'react-router';
import {ProtectedRouteProps} from '../types';

const Protected = ({isAuthenticated, children}: ProtectedRouteProps) => {
  if (!isAuthenticated) return <Navigate to="/login" />;

  return <>{children}</>;
};

export default Protected;
