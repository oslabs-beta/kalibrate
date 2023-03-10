import {Outlet} from 'react-router-dom';
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  ListSubheader,
  Typography,
  CircularProgress,
} from '@mui/material';
import {CloudDone, AddBox, Cloud} from '@mui/icons-material';
import {DashboardProps} from '../types';

// Display sidebar for connected client list
const Dashboard = (props: DashboardProps) => {
  const {connectedClient, selectedClient, setSelectedClient, storedClients, isLoading} = props;

  return (
    <>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 250,
          flexShrink: 0,
          background: '#edf8fe',
          [`& .MuiDrawer-paper`]: {
            width: 250,
            boxSizing: 'border-box',
            background: '#edf8fe',
            justifyContent: 'space-between',
          },
        }}
      >
        <Box>
          {/* Toolbar is used to bump content below the navbar */}
          <Toolbar />

          <Box sx={{overflow: 'auto'}}>
            <List disablePadding>
              <ListSubheader sx={{background: '#edf8fe'}}>My Clients</ListSubheader>
              {
                // List in the sidebar of all saved client
                storedClients.map(client => (
                  <ListItem key={client.clientId} disablePadding>
                    <ListItemButton
                      selected={selectedClient === client.clientId}
                      onClick={() => setSelectedClient(client.clientId)}
                    >
                      {/* Connected icon  displays connected client icon and loading wheel when loading */}
                      {connectedClient !== client.clientId ? (
                        <ListItemIcon>
                          <Cloud sx={{color: '#767d80'}} />
                        </ListItemIcon>
                      ) : isLoading ? (
                        <ListItemIcon>
                          <CircularProgress size="24px" />
                        </ListItemIcon>
                      ) : (
                        <ListItemIcon>
                          <CloudDone sx={{color: '#a3c87b'}} />
                        </ListItemIcon>
                      )}

                      <ListItemText>
                        <Typography noWrap>{client.clientId}</Typography>
                      </ListItemText>
                    </ListItemButton>
                  </ListItem>
                ))
              }
            </List>
          </Box>
        </Box>

        {/* Bottom add a new client button */}
        <Box>
          <List disablePadding>
            <Divider />
            <ListItem key="connect-button" disablePadding>
              <ListItemButton
                selected={selectedClient === ''}
                onClick={() => setSelectedClient('')}
              >
                <ListItemIcon>
                  <AddBox sx={{color: '#a3c87b'}} />
                </ListItemIcon>
                <ListItemText primary="Add new client" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Toolbar is used to bump content below the navbar */}
      <Box component="main" sx={{flexGrow: 1, p: 3}}>
        {/* <Toolbar /> */}
        <Outlet />
      </Box>
    </>
  );
};

export default Dashboard;
