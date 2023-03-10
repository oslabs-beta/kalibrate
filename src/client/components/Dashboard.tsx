import {useNavigate, Outlet} from 'react-router-dom';
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
} from '@mui/material';
import {DashboardProps} from '../types';
import {tokens} from '../theme';

const drawerWidth = 200;

// Display sidebar for connected cluster list
const Dashboard = (props: DashboardProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const {isConnected, sessionClusters, setConnectedCluster} = props;

  return (
    <Box sx={{display: 'flex'}}>
      <Drawer
        variant="persistent"
        anchor="left"
        open={isConnected}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: '2px outset' + colors.secondary[300],
            background: colors.manage[500],
          },
        }}
      >
        <Toolbar />
        <Box sx={{overflow: 'auto'}}>
          <List>
            {
              // List in the sidebar all currently connected clusters
              sessionClusters.map((text: string) => (
                <ListItem
                  key={text}
                  sx={{
                    borderRadius: '5px',
                    border: '2px outset' + colors.secondary[300],
                    backgroundColor: colors.secondary[300],
                  }}
                  disablePadding
                >
                  <ListItemButton
                    onClick={() => {
                      // functionality to navigate to a cluster by clicking on it
                      setConnectedCluster(text);
                      navigate('/' + text);
                    }}
                  >
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))
            }
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
