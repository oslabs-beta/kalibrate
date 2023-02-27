import {Outlet, useLocation, useNavigate} from 'react-router-dom';
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

const Manage = () => {
  const navigate = useNavigate();

  const {state} = useLocation();
  if (state) {
    const {clusterName} = state;
  }
  // console.log('Manage state passed from Dashboard', state);

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
              <ListItem key="Brokers" disablePadding>
                <ListItemButton
                  onClick={() => navigate('brokers', {state: {clusterName: clusterName}})}
                >
                  <ListItemText primary="Brokers" />
                </ListItemButton>
              </ListItem>

              <ListItem key="Topics" disablePadding>
                <ListItemButton
                  onClick={() => navigate('topics', {state: {clusterName: clusterName}})}
                >
                  <ListItemText primary="Topics" />
                </ListItemButton>
              </ListItem>

              <ListItem key="Producers" disablePadding>
                <ListItemButton
                  onClick={() => navigate('producers', {state: {clusterName: clusterName}})}
                >
                  <ListItemText primary="Producers" />
                </ListItemButton>
              </ListItem>

              <ListItem key="Consumers" disablePadding>
                <ListItemButton
                  onClick={() => navigate('consumers', {state: {clusterName: clusterName}})}
                >
                  <ListItemText primary="Consumers" />
                </ListItemButton>
              </ListItem>
            </Collapse>

            <ListItem key="Monitor" disablePadding>
              <ListItemButton onClick={() => setOpenMonitor(prev => !prev)}>
                <ListItemText primary="Monitor" />
                {openMonitor ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openMonitor} timeout="auto" unmountOnExit>
              <ListItem key="Throughput" disablePadding>
                <ListItemButton
                  onClick={() => navigate('throughput', {state: {clusterName: clusterName}})}
                >
                  <ListItemText primary="Throughput" />
                </ListItemButton>
              </ListItem>
              <ListItem key="Lag" disablePadding>
                <ListItemButton
                  onClick={() => navigate('lag', {state: {clusterName: clusterName}})}
                >
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
                <ListItemButton
                  onClick={() => navigate('produce', {state: {clusterName: clusterName}})}
                >
                  <ListItemText primary="Produce" />
                </ListItemButton>
              </ListItem>
              <ListItem key="Consume" disablePadding>
                <ListItemButton
                  onClick={() => navigate('consume', {state: {clusterName: clusterName}})}
                >
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
