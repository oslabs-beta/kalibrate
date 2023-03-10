import {useState} from 'react';
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
import {useTheme} from '@mui/material/styles';
import {tokens} from '../theme';

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // form state
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

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

      navigate('/');
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
          id="outlined-basic"
          size="small"
          label="Email"
          variant="outlined"
          value={email}
          onChange={event => setEmail(event.target.value)}
          sx={{marginBottom: '10px', width: '100%'}}
        />

        <TextField
          id="outlined-basic"
          size="small"
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          sx={{marginBottom: '20px', width: '100%'}}
        />

        {isLoading ? (
          <CircularProgress sx={{marginTop: '15px'}} />
        ) : (
          <Button
            variant="contained"
            size="medium"
            disabled={!isValidLoginSubmission(email, password)}
            onClick={handleLoginSubmit}
            sx={{fontWeight: 'bold', width: 'auto'}}
          >
            Log in
          </Button>
        )}
        {isError ? (
          <Alert severity="error" sx={{marginTop: '10px'}}>
            Email or password is incorrect
          </Alert>
        ) : null}

        <Typography>Don't have an account?</Typography>
        <Link to="/signup">
          <Typography sx={{color: colors.accent[300]}}>Sign up</Typography>
        </Link>
      </Box>
    </Container>
  );
};

export default Login;
