import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router';
import {Link} from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import {SignupProps} from '../types';

const Signup = ({setIsAuthenticated}: SignupProps) => {
  const navigate = useNavigate();

  // form state
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmedPassword, setConfirmedPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // verify names have been entered
  const isValidName = (firstName: string, lastName: string) => {
    return firstName.length > 0 && lastName.length > 0;
  };

  // verify email is valid address
  const isValidEmail = (email: string) => {
    const emailRequirements =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return email.match(emailRequirements);
  };

  // verify pw requirements met: 8 characters, at least one numeric digit, one uppercase letter and one lowercase letter
  const isValidPassword = (password: string) => {
    const passwordRequirements = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return password.match(passwordRequirements);
  };

  // verify passwords match
  const isValidConfirmedPassword = (confirmedPassword: string, password: string) => {
    return confirmedPassword === password;
  };

  // check if all fields have been filled
  const isCompleteSignupSubmission = (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmedPassword: string
  ) => {
    return (
      firstName.length &&
      lastName.length &&
      email.length &&
      password.length &&
      confirmedPassword.length
    );
  };

  const handleSignupSubmit = async () => {
    setIsLoading(true);

    // validate fields and handle errors, resetting pw fields if error occurs
    if (!isValidName(firstName, lastName)) {
      setErrorMessage('Please enter a first and last name');
      setPassword('');
      setConfirmedPassword('');
      setIsError(true);
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Email is not valid');
      setPassword('');
      setConfirmedPassword('');
      setIsError(true);
      setIsLoading(false);
      return;
    }

    if (!isValidPassword(password)) {
      setErrorMessage(
        'Password must be 8 character in length, and contain one number, one uppercase letter, and one lowercase letter'
      );
      setPassword('');
      setConfirmedPassword('');
      setIsError(true);
      setIsLoading(false);
      return;
    }

    if (!isValidConfirmedPassword(password, confirmedPassword)) {
      setErrorMessage('Passwords do not match');
      setPassword('');
      setConfirmedPassword('');
      setIsError(true);
      setIsLoading(false);
      return;
    }

    // if no errors, attempt to create account and navigate to home page on success
    const signupCredentials = {
      firstName,
      lastName,
      email,
      password,
    };

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupCredentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.err);
      }

      setIsAuthenticated(true);
      navigate('/dashboard'); // todo: may need to set global with response body state before navigating?
    } catch (err: any) {
      // end loading, display error, and reset password fields on unsuccessful login
      setIsLoading(false);
      setPassword('');
      setConfirmedPassword('');
      setErrorMessage(`${err.message}`);
      setIsError(true);
    }
  };

  // conditionally rendering loading wheel and alert message
  return (
    <Container
      maxWidth="xs"
      sx={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          paddingX: '30px',
          paddingY: '15px',
          outline: '1px solid #afafaf',
          borderRadius: '5px',
          alignItems: 'center',
          width: '100%',
          backgroundColor: '#fefefe',
        }}
      >
        <Typography variant="h5" sx={{marginBottom: '15px'}}>
          Sign up for Kalibrate
        </Typography>

        <TextField
          id="outlined-basic"
          size="small"
          label="First name"
          variant="outlined"
          value={firstName}
          onChange={event => setFirstName(event.target.value)}
          sx={{marginBottom: '10px', width: '100%', backgroundColor: '#fcfcfc'}}
        />

        <TextField
          id="outlined-basic"
          size="small"
          label="Last name"
          variant="outlined"
          value={lastName}
          onChange={event => setLastName(event.target.value)}
          sx={{marginBottom: '10px', width: '100%', backgroundColor: '#fcfcfc'}}
        />

        <TextField
          id="outlined-basic"
          size="small"
          label="Email"
          variant="outlined"
          value={email}
          onChange={event => setEmail(event.target.value)}
          sx={{marginBottom: '10px', width: '100%', backgroundColor: '#fcfcfc'}}
        />

        <TextField
          id="outlined-basic"
          size="small"
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          sx={{marginBottom: '10px', width: '100%', backgroundColor: '#fcfcfc'}}
        />

        <TextField
          id="outlined-basic"
          size="small"
          label="Confirm password"
          variant="outlined"
          type="password"
          value={confirmedPassword}
          onChange={event => setConfirmedPassword(event.target.value)}
          sx={{marginBottom: '10px', width: '100%', backgroundColor: '#fcfcfc'}}
        />

        {isLoading ? (
          <CircularProgress sx={{marginTop: '15px'}} />
        ) : (
          <Button
            variant="contained"
            size="medium"
            disabled={
              !isCompleteSignupSubmission(firstName, lastName, email, password, confirmedPassword)
            }
            onClick={handleSignupSubmit}
            sx={{fontWeight: 'bold', marginTop: '15px', width: 'auto'}}
          >
            Sign up
          </Button>
        )}

        {isError ? (
          <Alert severity="error" sx={{marginTop: '10px'}}>
            {errorMessage}
          </Alert>
        ) : null}

        <hr />

        <Typography>Already have an account?</Typography>
        <Link to="/login">Log in</Link>
      </Box>
    </Container>
  );
};

export default Signup;
