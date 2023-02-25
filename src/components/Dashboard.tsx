import {Link, Outlet,useNavigate} from 'react-router-dom';
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

  const {clientId} = props;

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
            {['cluster-1', 'cluster-2'].map(text => (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  onClick={() => navigate('/cluster-name', {state: {clusterName: text}})}
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
