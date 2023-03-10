import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router';
import Loading from './Loading';
import {RedirectProps} from '../types';

const Redirect = ({isAuthenticated, setIsAuthenticated, children}: RedirectProps) => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState<boolean>(false);

  useEffect(() => {
    // redirect to dashboard if authenticated
    if (isAuthenticated) navigate('/dashboard');

    // attempt to verify cookie - update authentication state and redirect to dashboard on success
    fetch('/api/session').then(response => {
      if (response.ok) {
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        setIsChecked(true);
      }
    });
  });

  return isChecked ? <>{children}</> : <Loading />;
};

export default Redirect;
