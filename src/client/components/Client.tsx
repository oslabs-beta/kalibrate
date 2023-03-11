import {useNavigate} from 'react-router';
import {Grid, Button, Box, Alert, Typography, CircularProgress} from '@mui/material';
import {Delete, Send, Cloud, CloudDone} from '@mui/icons-material';
import {useTheme} from '@mui/material/styles';
import {tokens} from '../theme';
import {ClientProps} from '../types';

const Client = (props: ClientProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {selectedClient, connectedClient, setConnectedClient, storedClients, isLoading, isError} =
    props;

  // filter for currently selected client object
  const selectedClientCrendentials = storedClients.filter(
    storedClients => storedClients.clientId === selectedClient
  )[0];

  // generate list to render from selected client credentials
  const selectedClientCredentialsList = [
    <Typography key="clientId">
      <strong>Client Id: </strong>
      {`${selectedClientCrendentials.clientId}`}
    </Typography>,
    <Typography key="brokers">
      <strong>URI: </strong>
      {`${selectedClientCrendentials.brokers}`}
    </Typography>,
  ];

  // check if selected connection includes sasl and add to list
  if (selectedClientCrendentials.sasl) {
    selectedClientCredentialsList.push(
      <Typography key="ssl">
        <strong>SSL: </strong>
        {`${selectedClientCrendentials.ssl}`}
      </Typography>,
      <Typography key="mechanism">
        <strong>Mechanism: </strong>
        {`${selectedClientCrendentials.sasl.mechanism}`}
      </Typography>,
      <Typography key="username">
        <strong>Username: </strong>
        {`${selectedClientCrendentials.sasl.username}`}
      </Typography>
    );
  }

  // renders credentials for selected client
  // conditionally renders button disabled state and loading wheel based on loading state
  // conditionally renders error message based on error state
  return (
    <Grid
      container
      direction="column"
      justifyContent="space-evenly"
      alignItems="center"
      sx={{height: '90vh', width: 'calc(100vw + 202px)'}}
    >
      <Box
        sx={{
          '& .MuiTextField-root': {m: 1, width: '25ch'},
          padding: '30px',
          border: '1px solid' + colors.info[300],
          borderRadius: '5px',
          backgroundColor: colors.background[500],
        }}
      >
        {selectedClientCredentialsList}

        <Box sx={{display: 'flex'}}>
          <Button
            variant="contained"
            size="medium"
            disabled={connectedClient !== selectedClient || isLoading}
            onClick={() => navigate(`/client/${selectedClient}`)}
            endIcon={<Send />}
            sx={{fontWeight: 'bold', width: 'auto', marginX: '10px', marginTop: '20px'}}
          >
            Manage
          </Button>

          {isLoading ? (
            <CircularProgress sx={{marginTop: '15px', marginX: '63px'}} />
          ) : (
            <Button
              variant="outlined"
              color="success"
              size="medium"
              disabled={connectedClient === selectedClient}
              onClick={() => setConnectedClient(selectedClient)}
              endIcon={connectedClient === selectedClient ? <CloudDone /> : <Cloud />}
              sx={{
                fontWeight: 'bold',
                width: 'auto',
                marginX: '10px',
                marginTop: '20px',
                color: '#a3c87b',
              }}
            >
              {connectedClient === selectedClient ? 'Connected' : 'Connect'}
            </Button>
          )}

          <Button
            variant="outlined"
            color="error"
            size="medium"
            disabled={isLoading}
            onClick={() => console.log('todo delete button')}
            endIcon={<Delete />}
            sx={{fontWeight: 'bold', width: 'auto', marginX: '10px', marginTop: '20px'}}
          >
            Delete
          </Button>
        </Box>

        {isError ? (
          <Alert severity="error" sx={{marginTop: '10px'}}>
            Failed to connect.
          </Alert>
        ) : null}
      </Box>
    </Grid>
  );
};

export default Client;