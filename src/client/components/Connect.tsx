import {useState, SyntheticEvent} from 'react';
import {Grid, Button, TextField, Box, Checkbox, Alert} from '@mui/material';
import {ConnectProps, connectionConfig} from '../types';
import '../stylesheets/style.scss';
import crow from './assets/crow2.png';
import {useTheme} from '@mui/material/styles';
import {tokens} from '../theme';

const Connect = ({setSelectedClient, storedClients, setStoredClients}: ConnectProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // controlled state for form
  const [clientId, setClientId] = useState('');
  const [brokers, setBrokers] = useState('');
  const [sasl, setSasl] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginInProgress, setLoginInProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // form submission handler
  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    // input validation
    if (!clientId)
      return setErrorMessage('Enter a Client ID to identify this cluster within Kalibrate.');

    if (storedClients.filter(storedClient => storedClient.clientId === clientId).length)
      return setErrorMessage('Client IDs must be unique.');

    if (!brokers) return setErrorMessage('Seed broker is required.');
    if (sasl && !username) return setErrorMessage('Username is required when SASL is selected.');
    if (sasl && !password) return setErrorMessage('Password is required when SASL is selected.');

    // create config object to send in request
    const connectionConfig: connectionConfig = {
      clientId,
      brokers: [brokers],
    };

    if (sasl) {
      connectionConfig.ssl = true;

      connectionConfig.sasl = {
        mechanism: 'plain',
        username,
        password,
      };
    }

    setLoginInProgress(true);

    try {
      // Send POST request to connect
      const response = await fetch('api/connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(connectionConfig),
      });

      // handle failed connection
      if (response.status === 429) {
        setErrorMessage('Too many requests. Wait a minute and try again.');
      } else if (response.status === 403) {
        setErrorMessage('Failed to connect. Verify credentials.');
      } else if (!response.ok) {
        setErrorMessage('An unknown error occurred.');
      }
      if (!response.ok) throw new Error();
      setErrorMessage('');

      // update global state
      const client = await response.json();
      setStoredClients([...storedClients, client]); // add to the list
      setSelectedClient(client.clientId); // update selection to the addition
    } catch {
      // if (errorMessage === '') setErrorMessage('Failed to connect. Verify credentials.');
    } finally {
      setLoginInProgress(false);
    }
  };

  // username and password conditionally rendered based on whether SASL is true
  // error message conditionally rendered based on form submission input validation
  return (
    <Grid
      container
      direction="column"
      justifyContent="space-evenly"
      alignItems="center"
      textAlign="center"
      sx={{
        height: '90vh',
        width: 'calc(100vw + 202px)',
      }}
    >
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': {m: 1, width: '350px'},
          padding: '30px',
          border: '1px solid' + colors.info[300],
          borderRadius: '5px',
          backgroundColor: colors.background[500],
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <div className="connectText">Add a New Client</div>

        <Grid>
          <TextField
            size="small"
            label="Client ID"
            variant="outlined"
            value={clientId}
            onChange={event => setClientId(event.target.value)}
          />
        </Grid>

        <Grid>
          <TextField
            size="small"
            label="URI"
            variant="outlined"
            value={brokers}
            onChange={event => setBrokers(event.target.value)}
          />
        </Grid>

        <Grid>
          <Checkbox
            checked={sasl}
            onChange={() => setSasl(!sasl)}
            inputProps={{'aria-label': 'controlled'}}
          />
          SASL
        </Grid>

        {sasl ? (
          <>
            <Grid>
              <TextField
                label="Username"
                variant="outlined"
                size="small"
                value={username}
                onChange={event => setUsername(event.target.value)}
              />
            </Grid>

            <Grid>
              <TextField
                id="outlined-password-input"
                label="Password"
                type="password"
                size="small"
                value={password}
                onChange={event => setPassword(event.target.value)}
              />
            </Grid>
          </>
        ) : null}

        <Grid>
          <span className="loadingSpan">
            {
              // conditional rendering based on whether login attempt is in progress
              loginInProgress ? (
                <img className="rotocrow rotation" src={crow}></img>
              ) : (
                <Button
                  variant="contained"
                  size="medium"
                  type="submit"
                  disabled={
                    !(sasl
                      ? !!clientId && !!brokers && !!username && !!password
                      : !!clientId && !!brokers)
                  }
                  sx={{fontWeight: 'bold', marginTop: '15px'}}
                >
                  {loginInProgress ? 'Connecting...' : 'Save'}
                </Button>
              )
            }
          </span>
        </Grid>

        {errorMessage.length ? (
          <Grid>
            <Alert className="err" severity="error">
              {errorMessage}
            </Alert>
          </Grid>
        ) : null}
      </Box>
    </Grid>
  );
};

export default Connect;
