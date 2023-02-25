import React from 'react';
import {Link, Outlet, useLocation} from 'react-router-dom';
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
  Collapse,
} from '@mui/material';
import {ExpandLess, ExpandMore} from '@mui/icons-material';
import {useState} from 'react';

const drawerWidth = 150;

const Manage = props => {
  const {clientId} = props;

  const {state} = useLocation();
  const {clusterName} = state;
  // console.log('STATE IN MANAGE',state);

  const [openManage, setOpenManage] = useState(false);
  const [openMonitor, setOpenMonitor] = useState(false);
  const [openTest, setOpenTest] = useState(false);


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
            <ListItem key="Manage" disablePadding>
              <ListItemButton onClick={() => setOpenManage(prev => !prev)}>
                <ListItemText primary="Manage" />
                {openManage ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openManage} timeout="auto" unmountOnExit>
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
            </Collapse>

            <ListItem key="Monitor" disablePadding>
              <ListItemButton onClick={() => setOpenMonitor(prev => !prev)}>
                <ListItemText primary="Monitor" />
                {openMonitor ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openMonitor} timeout="auto" unmountOnExit>
            <ListItem key="Throughput" disablePadding>
                  <ListItemButton>
                    <ListItemText primary="Throughput" />
                  </ListItemButton>
                </ListItem>
                <ListItem key="Lag" disablePadding>
                  <ListItemButton>
                    <ListItemText primary="Lag" />
                  </ListItemButton>
                </ListItem>

            </Collapse>


            <ListItem key="Test" disablePadding>
              <ListItemButton onClick={() => setOpenTest(prev => !prev)}>
                <ListItemText primary="Test" />
                {openTest ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openTest} timeout="auto" unmountOnExit>
            <ListItem key="Produce" disablePadding>
                  <ListItemButton>
                    <ListItemText primary="Produce" />
                  </ListItemButton>
                </ListItem>
                <ListItem key="Consume" disablePadding>
                  <ListItemButton>
                    <ListItemText primary="Consume" />
                  </ListItemButton>
                </ListItem>
            </Collapse>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{flexGrow: 1, p: 3}}>
        <Toolbar />
        <Typography paragraph>{state.clusterName}</Typography>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Manage;
