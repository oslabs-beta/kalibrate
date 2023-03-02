import {useNavigate, Outlet} from 'react-router-dom';
import {Box, Drawer, Toolbar, List, ListItem, ListItemButton, ListItemText} from '@mui/material';
import {DashboardProps} from './managePages/types';

const drawerWidth = 150;

const Dashboard = (props: DashboardProps) => {
  const navigate = useNavigate();

  const {sessionClusters, setConnectedCluster} = props;

  return (
    <Box sx={{display: 'flex'}}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: '#edf8fe',
          },
        }}
      >
        <Toolbar />
        <Box sx={{overflow: 'auto', background: '#edf8fe'}}>
          <List>
            {sessionClusters.map((text: string) => (
              <ListItem
                key={text}
                sx={{
                  background: '#edf8fe',
                  border: '1px outset #c2dfe3',
                  borderRadius: '5px',
                }}
                disablePadding
              >
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
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
