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
  Button
} from '@mui/material';

const drawerWidth = 150;

const Dashboard = props => {
  const navigate = useNavigate();

  const {connectedCluster, sessionClusters, setConnectedCluster} = props;

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
          <Button 
          variant ='contained'
          style={{position: 'absolute', bottom: 10, marginLeft: 20}}
          color = 'inherit'
          onClick = {()=> {
            navigate('/connect');
          }}
          >
            Connect
          </Button>
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
