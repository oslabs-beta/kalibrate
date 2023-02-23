import React from 'react';
import {Link, Outlet} from 'react-router-dom';
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

const Manage = (props) => {

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
            <Link to="brokers" style={{textDecoration: 'none', color: 'inherit'}}>
              <ListItem key="Brokers" disablePadding>
                <ListItemButton>
                  <ListItemText primary="Brokers" />
                </ListItemButton>
              </ListItem>
            </Link>

            <Link to="topics" style={{textDecoration: 'none', color: 'inherit'}}>
              <ListItem key="Topics" disablePadding>
                <ListItemButton>
                  <ListItemText primary="Topics" />
                </ListItemButton>
              </ListItem>
            </Link>

            <Link to="producers" style={{textDecoration: 'none', color: 'inherit'}}>
              <ListItem key="Producers" disablePadding>
                <ListItemButton>
                  <ListItemText primary="Producers" />
                </ListItemButton>
              </ListItem>
            </Link>

            <Link to="consumers" style={{textDecoration: 'none', color: 'inherit'}}>
              <ListItem key="Consumers" disablePadding>
                <ListItemButton>
                  <ListItemText primary="Consumers" />
                </ListItemButton>
              </ListItem>
            </Link>

            <ListItem key="etc" disablePadding>
              <ListItemButton>
                <ListItemText primary="etc" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{flexGrow: 1, p: 3}}>
        <Toolbar />
        <Typography paragraph>{clientId}</Typography>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Manage;
