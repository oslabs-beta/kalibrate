import {useState} from 'react';
import {Grid, Button, TextField, Box, Checkbox} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import '../stylesheets/style.css';
import crow from './assets/crow2.png';

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

// interface Props {
//   setConnectedCluster: React.Dispatch<React.SetStateAction<{
//     cluster: {brokers: []},
//     admin: {topics: []},
//   }>>,
//   sessionClusters: string[],
//   setSessionClusters: React.Dispatch<React.SetStateAction<boolean>>,
//   setIsConnected: React.Dispatch<React.SetStateAction<boolean>>,
// }

const Connect = props => {
  const navigate = useNavigate();
  const {setConnectedCluster, sessionClusters, setSessionClusters, setIsConnected} = props;
  console.log('(CONNECT) session clusters', sessionClusters);

  // controlled state for form
  const [clientId, setClientId] = useState('');
  const [brokers, setBrokers] = useState('');
  const [sasl, setSasl] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginInProgress, setLoginInProgress] = useState(false);

  // state for displaying form input errors
  const [errorMessage, setErrorMessage] = useState('');

  // form submission handler
  const handleSubmit = async event => {
    event.preventDefault();

    // input validation
    if (!clientId)
      return setErrorMessage('Enter a Client ID to identify this cluster within Kalibrate.');
    if (sessionClusters.includes(clientId)) return setErrorMessage('Client IDs must be unique.');
    if (!brokers) return setErrorMessage('Seed broker is required.');
    if (sasl && !username) return setErrorMessage('Username is required when SASL is selected.');
    if (sasl && !password) return setErrorMessage('Password is required when SASL is selected.');

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
      if (!response.ok) throw new Error();
      if (response.ok) setErrorMessage('');

      // update global state and navigate to dashboard
      setIsConnected(true);

      setConnectedCluster(clientId);
      const newSessionClusters = [...sessionClusters, clientId];
      setSessionClusters(newSessionClusters);
      setPassword('');
      setClientId('');
      setSasl(false);
      setUsername('');
      setBrokers('');

      navigate('/');
    } catch {
      setErrorMessage('Failed to connect. Verify credentials.');
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
      height="500px"
      textAlign={'center'}
    >
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': {m: 1, width: '25ch'},
          padding: '15px',
          border: '2px outset #253237',
          borderRadius: '8px',
          background: 'white',
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <h1>Connect to a Cluster</h1>

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
          <span className="loadingSpan">
            {loginInProgress ? <img className="rotocrow rotation" src={crow}></img> : null}
            <Button variant="outlined" size="medium" type="submit">
              {loginInProgress ? 'Connecting...' : 'Connect'}
            </Button>
          </span>
        </Grid>

        {errorMessage.length ? (
          <Grid>
            <h3 className="err">{errorMessage}</h3>
          </Grid>
        ) : null}
      </Box>
    </Grid>
  );
};

export default Connect;
