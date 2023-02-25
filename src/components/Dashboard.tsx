import {Link, Outlet} from 'react-router-dom';
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
  const {clientId} = props;

  const [clusterData, setClusterData] = useState({});
  const [stableData, setStableData] = useState({});

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
            <Link to="/cluster-name" style={{textDecoration: 'none', color: 'inherit'}}>
              <ListItem key={clientId} disablePadding>
                <ListItemButton>
                  <ListItemText primary={clientId} />
                </ListItemButton>
              </ListItem>
            </Link>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{flexGrow: 1, p: 3}}>
        <Toolbar />
        <Typography paragraph>Toplevel info</Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
