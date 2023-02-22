import React from 'react';
import { useState } from 'react';
import {Grid, Button, TextField, Box, Checkbox} from '@mui/material';

const Connect = (props) => {

  const { clientId, setClientId } = props;

  const [host, setHost] = useState('');
  const [mechanism, setMechanism] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(false);

  const handleSubmit = () => {
    console.log(clientId);
  };

  const handleChange = () => {
    setChecked(!checked);
  }
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
            label="Host"
            variant="outlined"
            value={host}
            onChange={event => setHost(event.target.value)}
          />
        </Grid>
        <Grid>
          SSL
          <Checkbox
            checked={checked}
            onChange= {handleChange}
            inputProps={{'aria-label': 'controlled'}}
          />
        </Grid>
        <Grid>
          <TextField
            id="outlined-basic"
            label="Mechanism"
            variant="outlined"
            size="small"
            value={mechanism}
            onChange={event => setMechanism(event.target.value)}
          />
        </Grid>
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
        <Grid>
          <Button variant="outlined" size="medium" type="submit">
            Connect
          </Button>
        </Grid>
      </Box>
    </Grid>
  );
};

export default Connect;
