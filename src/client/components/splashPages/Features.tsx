import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import manage from '../assets/manage.svg';
import chart from '../assets/chart.svg';
import auth from '../assets/auth.svg';
import alerts from '../assets/alerts.svg';
import create from '../assets/create.svg';
import views from '../assets/views.svg';
import testing from '../assets/testing.svg';
import preferences from '../assets/preferences.svg';

const Features = () => {
  const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
  }));

  return (
    <section>
      <h3 style={{fontSize: '1.5rem'}}>What features are included in Kalibrate?</h3>
      <Box sx={{flexGrow: 1, width: '60rem'}}>
        <Grid container spacing={2}>
          <Grid xs={3}>
            <Item sx={{height: '15rem'}}>
              <img src={manage} style={{marginTop: '10px'}}/>
              <h4>Multi-Cluster Management</h4>
              <p>Connect to and manage multiple clusters during active sessions in the tool</p>
            </Item>
          </Grid>
          <Grid xs={3}>
            <Item sx={{height: '15rem'}}>
              <img src={chart} style={{marginTop: '10px'}}/>
              <h4>Performance Monitoring</h4>
              <p>Track real-time cluster-level metrics, including throughput, lag, and offsets</p>
            </Item>
          </Grid>
          <Grid xs={3}>
            <Item sx={{height: '15rem'}}>
              <img src={auth} style={{marginTop: '10px'}}/>
              <h4>Site Authentication</h4>
              <p>Maintain trust in our app's encryption, hashing, and salting database storage methods</p>
            </Item>
          </Grid>
          <Grid xs={3}>
            <Item sx={{height: '15rem'}}>
              <img src={alerts} style={{marginTop: '10px'}}/>
              <h4>Alerts & Notifications</h4>
              <p>Receive in-app alerts and slack and email notifications based on metric fluctuations</p>
            </Item>
          </Grid>
          <Grid xs={3}>
            <Item sx={{height: '15rem'}}>
              <img src={create} style={{marginTop: '10px'}}/>
              <h4>CRUD Operations</h4>
              <p>Execute create, read, update, and delete
              functionality for brokers and topics</p>
            </Item>
          </Grid>
          <Grid xs={3}>
            <Item sx={{height: '15rem'}}>
              <img src={views} style={{marginTop: '10px'}}/>
              <h4>Detailed Cluster Views</h4>
              <p>View cluster-specific topic, partition, message, and consumer data</p>
            </Item>
          </Grid>
          <Grid xs={3}>
            <Item sx={{height: '15rem'}}>
              <img src={testing} style={{marginTop: '10px'}}/>
              <h4>Development Testing Suite</h4>
              <p>Navigate the tool with assurance in our unit and integration test suite for UI and the backend</p>
            </Item>
          </Grid>
          <Grid xs={3}>
            <Item sx={{height: '15rem'}}>
              <img src={preferences} style={{marginTop: '10px'}}/>
              <h4>User Preferences</h4>
              <p>Choose whether to use the tool in light or dark mode during an active session</p>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </section>
  );
};

export default Features;
