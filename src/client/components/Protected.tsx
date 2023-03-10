import {useEffect} from 'react';
import {useNavigate} from 'react-router';
import {ProtectedProps} from '../types';

const Protected = ({isAuthenticated, setIsAuthenticated, children}: ProtectedProps) => {
  const navigate = useNavigate();

  // attempt to verify session cookie if user not authenticated, redirect to login on failure
  useEffect(() => {
    if (!isAuthenticated) {
      fetch('/api/session').then(response => {
        if (!response.ok) return navigate('/login');

        setIsAuthenticated(true);
      });
    }
  }, []);

  return <>{children}</>;
};

export default Protected;
