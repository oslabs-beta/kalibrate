import {useState} from 'react';
import {Grid, Button, TextField, Box, Checkbox} from '@mui/material';
import {useNavigate} from 'react-router-dom';

/*
CONNECTION FORM OPTIONS
- client (string)*
- seed (string)*
- sasl checkbox
  if true:
    - username*
    - password*

todo: add additional connection mechanisms (oauth, aws, etc), currently just using plain
*/

const Connect = ({setConnectedCluster}) => {
  const navigate = useNavigate();

  // controlled state for form
  const [clientId, setClientId] = useState('');
  const [brokers, setBrokers] = useState('');
  const [sasl, setSasl] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // state for displaying form input errors
  const [errorMessage, setErrorMessage] = useState('');

  // form submission handler
  const handleSubmit = async event => {
    event.preventDefault();

    // input validation
    if (!clientId) return setErrorMessage('Client ID is required.');
    if (!brokers) return setErrorMessage('Seed broker is required.');
    if (sasl && !username) return setErrorMessage('Username is required when SASL enabled.');
    if (sasl && !password) return setErrorMessage('Password is required when SASL enabled.');

    // create config object to send in request
    const connectionConfig = {
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

    console.log('Attempting to connect:', connectionConfig);

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
      if (!response.ok) throw new Error();

      // update global state and redirect
      setConnectedCluster(clientId);
      navigate('/dashboard');
    } catch {
      setErrorMessage('Failed to connect.');
    }
  };

  // username and password conditionally rendered based on whether SASL is true
  // error message conditionally rendered based on form submission input validation
  return (
    <Grid container direction="column" justifyContent="space-evenly" alignItems="center">
      Connect to a Cluster
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': {m: 1, width: '25ch'},
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <Grid>
          <TextField
            id="outlined-basic"
            size="small"
            label="Client ID"
            variant="outlined"
            value={clientId}
            onChange={event => setClientId(event.target.value)}
          />
        </Grid>

        <Grid>
          <TextField
            id="outlined-basic"
            size="small"
            label="Seed Broker"
            variant="outlined"
            value={brokers}
            onChange={event => setBrokers(event.target.value)}
          />
        </Grid>

        <Grid>
          SASL
          <Checkbox
            checked={sasl}
            onChange={() => setSasl(!sasl)}
            inputProps={{'aria-label': 'controlled'}}
          />
        </Grid>

        {sasl ? (
          <>
            <Grid>
              <TextField
                id="outlined-basic"
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
          <Button variant="outlined" size="medium" type="submit">
            Connect
          </Button>
        </Grid>

        {errorMessage ? (
          <Grid>
            <h3>{errorMessage}</h3>
          </Grid>
        ) : null}
      </Box>
    </Grid>
  );
};

export default Connect;
