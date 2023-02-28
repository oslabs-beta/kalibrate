import {useNavigate} from 'react-router-dom';
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

  const {clientId, sessionClusters, setConnectedCluster} = props;

  const [clusterData, setClusterData] = useState({});
  const [stableData, setStableData] = useState({});

  // for testing purposes
  useEffect(() => {
    console.log('(DASHBOARD) fetched cluster data: ', clusterData);
    console.log('(DASHBOARD) fetched stabled data:', stableData);
  }, [clusterData, stableData]);
  console.log('(DASHBOARD) session clusters', sessionClusters);
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
