import {useNavigate, Outlet} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {
  Box,
  Drawer,
  CssBaseline,
  Toolbar,
  List,
  Typography,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';

const drawerWidth = 150;

const Dashboard = props => {
  const navigate = useNavigate();

  const {connectedCluster, sessionClusters, setConnectedCluster} = props;

  const [clusterData, setClusterData] = useState({});
  const [stableData, setStableData] = useState({});
  // console.log('array of connected clusters', sessionClusters)
  // on mount, make calls to GET cluster data and other admin data
  // TIL useEffect throws an error if you try to make it async
  useEffect(() => {
    fetch('api/cluster-info', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        const newData = {};
        Object.assign(newData, data);
        setClusterData(newData);
      })
      .catch(err => console.log(`from dashboard loading cluster data: ${err}`));

    fetch('api/stable-data', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        const newData = {};
        Object.assign(newData, data);
        setStableData(newData);
      })
      .catch(err => console.log(`from dashboard loading other admin data: ${err}`));
  }, []);

  // for testing purposes
  useEffect(() => {
    console.log('state updated: ');
    console.log('cluster: ', clusterData);
    console.log('stable:', stableData);
  }, [clusterData, stableData]);

  return (
    <Box sx={{display: 'flex'}}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {width: drawerWidth, boxSizing: 'border-box'},
        }}
      >
        <Toolbar />
        <Box sx={{overflow: 'auto'}}>
          <List>
            {sessionClusters.map(text => (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  onClick={() => {
                    setConnectedCluster(text);
                    navigate('/' + text);
                  }}
                >
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <List>
            <ListItem key="Connect" disablePadding sx={{position: 'fixed', bottom: 0}}>
              <ListItemButton onClick={() => navigate('/connect')}>
                <ListItemText primary="Connect" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{flexGrow: 1, p: 3}}>
        <Toolbar />
        {/* <Typography paragraph></Typography> */}
        {/* added outlet to render the table on the right of the sidebar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
