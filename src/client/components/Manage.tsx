import {Outlet, useNavigate} from 'react-router-dom';
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
  const navigate = useNavigate();

  const {connectedCluster} = props;

  const [openManage, setOpenManage] = useState(false);
  const [openMonitor, setOpenMonitor] = useState(false);
  const [openTest, setOpenTest] = useState(false);

  const lightBlue = '#c1d4de';
  //edf8fe
  //bfd4e0
  return (
    <Box sx={{display: 'flex'}}>
      {/* <CssBaseline /> */}
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
        <Box sx={{overflow: 'auto', background: lightBlue}}>
          <List className="no-padding-list">
            <ListItem key="Manage" disablePadding sx={{background: lightBlue}}>
              <ListItemButton
                onClick={() => setOpenManage(prev => !prev)}
                sx={
                  openManage
                    ? {
                        borderRadius: '5px',
                        border: '1px outset #c2dfe3',
                      }
                    : {borderRadius: '5px'}
                }
              >
                <ListItemText primary="Manage" />
                {openManage ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openManage} timeout="auto" unmountOnExit>
              <ListItem key="Brokers" disablePadding>
                <ListItemButton onClick={() => navigate('brokers')}>
                  <ListItemText primary="Brokers" />
                </ListItemButton>
              </ListItem>

              <ListItem key="Topics" disablePadding>
                <ListItemButton onClick={() => navigate('topics')}>
                  <ListItemText primary="Topics" />
                </ListItemButton>
              </ListItem>

              <ListItem key="Consumers" disablePadding>
                <ListItemButton onClick={() => navigate('consumers')}>
                  <ListItemText primary="Consumers" />
                </ListItemButton>
              </ListItem>
            </Collapse>

            <ListItem key="Monitor" disablePadding sx={{background: lightBlue}}>
              <ListItemButton
                onClick={() => setOpenMonitor(prev => !prev)}
                sx={
                  openMonitor
                    ? {
                        border: '1px outset #c2dfe3',
                        borderRadius: '5px',
                      }
                    : {}
                }
              >
                <ListItemText primary="Monitor" />
                {openMonitor ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openMonitor} timeout="auto" unmountOnExit>
              <ListItem key="Throughput" disablePadding>
                <ListItemButton onClick={() => navigate('throughput')}>
                  <ListItemText primary="Throughput" />
                </ListItemButton>
              </ListItem>
              <ListItem key="Lag" disablePadding>
                <ListItemButton onClick={() => navigate('lag')}>
                  <ListItemText primary="Lag" />
                </ListItemButton>
              </ListItem>
            </Collapse>

            <ListItem key="Test" disablePadding sx={{background: lightBlue}}>
              <ListItemButton
                onClick={() => setOpenTest(prev => !prev)}
                sx={
                  openTest
                    ? {
                        border: '1px outset #c2dfe3',
                        borderRadius: '5px',
                      }
                    : {}
                }
              >
                <ListItemText primary="Test" />
                {openTest ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openTest} timeout="auto" unmountOnExit>
              <ListItem key="Produce" disablePadding>
                <ListItemButton onClick={() => navigate('produce')}>
                  <ListItemText primary="Produce" />
                </ListItemButton>
              </ListItem>
              <ListItem key="Consume" disablePadding>
                <ListItemButton onClick={() => navigate('consume')}>
                  <ListItemText primary="Consume" />
                </ListItemButton>
              </ListItem>
            </Collapse>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{flexGrow: 1, p: 3}}>
        <Toolbar />
        {/* <Typography paragraph> {connectedCluster}</Typography> */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Manage;
