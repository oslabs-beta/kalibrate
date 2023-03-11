import {useState} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
} from '@mui/material';
import {ExpandLess, ExpandMore} from '@mui/icons-material';
import {useTheme} from '@mui/material/styles';
import {tokens} from '../theme';

const drawerWidth = 200;

// Display, in sidebar, management options for a selected cluster
const Manage = props => {
  const {connectedCluster} = props;
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [openManage, setOpenManage] = useState(false);
  const [openMonitor, setOpenMonitor] = useState(false);
  const [openTest, setOpenTest] = useState(false);

  // const lightBlue = 'c8d6de';

  // Drawer = wrapper for sidebar
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
            border: '2px outset' + colors.secondary[300],
            background: colors.manage[500],
          },
        }}
      >
        <Toolbar />

        <Box sx={{overflow: 'auto'}}>
          <List className="no-padding-list">
            <ListItem key="Overview" disablePadding>
              <ListItemButton
                onClick={() => navigate('/client/' + connectedCluster)}
                sx={{
                  borderRadius: '5px',
                  border: '1px outset' + colors.secondary[300],
                  backgroundColor: colors.secondary[300],
                }}
              >
                <ListItemText primary="Overview" />
              </ListItemButton>
            </ListItem>
          </List>

          <List className="no-padding-list">
            <ListItem key="Manage" disablePadding>
              <ListItemButton
                onClick={() => setOpenManage(prev => !prev)}
                sx={{
                  borderRadius: '5px',
                  border: '1px outset' + colors.secondary[300],
                  backgroundColor: colors.secondary[300],
                }}
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

            <ListItem key="Monitor" disablePadding>
              <ListItemButton
                onClick={() => setOpenMonitor(prev => !prev)}
                sx={{
                  borderRadius: '5px',
                  border: '1px outset' + colors.secondary[300],
                  backgroundColor: colors.secondary[300],
                }}
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

            <ListItem key="Test" disablePadding>
              <ListItemButton
                onClick={() => setOpenTest(prev => !prev)}
                sx={{
                  borderRadius: '5px',
                  border: '1px outset' + colors.secondary[300],
                  backgroundColor: colors.secondary[300],
                }}
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
        <Outlet />
      </Box>
    </Box>
  );
};

export default Manage;
