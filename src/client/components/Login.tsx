import React, {useState, useEffect} from 'react';
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
  InputLabel,
  IconButton,
  FormControl,
  InputAdornment,
  OutlinedInput,
} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import {LoginProps} from '../types';
import {useTheme} from '@mui/material/styles';
import {tokens} from '../theme';

const Login = ({setIsAuthenticated}: LoginProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // form state
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // verify email and password meet length requirements
  const isValidLoginSubmission = (email: string, password: string) => {
    const isValidEmail = email.length > 0;
    const isValidPassword = password.length >= 8;

    return isValidEmail && isValidPassword;
  };
  // login submission handler
  const handleLoginSubmit = async () => {
    setIsLoading(true);

    const loginCredentials = {
      email,
      password,
    };

    // navigate to home page on successful login
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginCredentials),
      });

      if (!response.ok) throw new Error();
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (err) {
      // end loading, display error, and reset form on unsuccessful login
      setEmail('');
      setPassword('');
      setIsLoading(false);
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
          outline: '1px solid' + colors.info[300],
          borderRadius: '5px',
          alignItems: 'center',
          width: '100%',
          backgroundColor: colors.background[500],
        }}
      >
        <Typography variant="h5" sx={{marginBottom: '15px'}}>
          Log into Kalibrate
        </Typography>
        <TextField
          size="small"
          label="Email"
          variant="outlined"
          value={email}
          onChange={event => setEmail(event.target.value)}
          sx={{marginBottom: '10px', width: '100%'}}
        />
        <FormControl sx={{width: '100%'}}>
          <InputLabel sx={{top: '-7px', width: '100%'}}>Password</InputLabel>
          <OutlinedInput
            size="small"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibilty"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          ></OutlinedInput>
        </FormControl>
        {isLoading ? (
          <CircularProgress sx={{marginTop: '15px'}} />
        ) : (
          <Button
            variant="contained"
            size="medium"
            disabled={!isValidLoginSubmission(email, password)}
            onClick={handleLoginSubmit}
            sx={{fontWeight: 'bold', width: 'auto', margin: '10px'}}
          >
            Log in
          </Button>
        )}
        {isError ? (
          <Alert severity="error" sx={{marginTop: '10px'}}>
            Email or password is incorrect
          </Alert>
        ) : null}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography>Forgot password?</Typography>
          <Link to="/forgot">
            <Typography sx={{color: colors.accent[300]}}>Reset Password</Typography>
          </Link>
          <Typography>Don't have an account?</Typography>
          <Link to="/signup">
            <Typography sx={{color: colors.accent[300]}}>Sign up</Typography>
          </Link>
        </div>
      </Box>
    </Container>
  );
};

export default Login;
