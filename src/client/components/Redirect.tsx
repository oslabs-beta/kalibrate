import {useEffect} from 'react';
import {Navigate, useNavigate} from 'react-router';
import {RedirectProps} from '../types';

const Redirect = ({isAuthenticated, setIsAuthenticated, children}: RedirectProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    // redirect to dashboard if authenticated
    if (isAuthenticated) navigate('/dashboard');

    // attempt to verify cookie - update authentication state and redirect to dashboard on success
    fetch('/api/session').then(response => {
      if (response.ok) {
        setIsAuthenticated(true);
        navigate('/dashboard');
      }
    });
  });

  return <>{children}</>;
};

export default Redirect;
