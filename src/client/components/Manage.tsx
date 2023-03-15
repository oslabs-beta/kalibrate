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
import {ManageProps} from '../types';

const drawerWidth = 200;

// Display, in sidebar, management options for a selected cluster
const Manage = (props: ManageProps) => {
  const {connectedCluster} = props;
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [openManage, setOpenManage] = useState(false);
  const [openMonitor, setOpenMonitor] = useState(false);

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
            borderRight: '1px outset' + colors.secondary[900],
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
                  border: '1px outset' + colors.secondary[200],
                  backgroundColor: colors.secondary[100],
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
                  border: '1px outset' + colors.secondary[200],
                  backgroundColor: colors.secondary[100],
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
                  border: '1px outset' + colors.secondary[200],
                  backgroundColor: colors.secondary[100],
                }}
              >
                <ListItemText primary="Monitor" />
                {openMonitor ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={openMonitor} timeout="auto" unmountOnExit>
              <ListItem key="traffic" disablePadding>
                <ListItemButton onClick={() => navigate('traffic')}>
                  <ListItemText primary="Traffic and Health" />
                </ListItemButton>
              </ListItem>

              <ListItem key="offsets" disablePadding>
                <ListItemButton onClick={() => navigate('offsets')}>
                  <ListItemText primary="Offsets" />
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
