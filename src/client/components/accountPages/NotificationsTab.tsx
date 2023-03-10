import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
  AppBar,
  Container,
  Paper,
  Box,
  Button,
  Typography,
  Tab,
  useTheme,
  TextField,
  InputAdornment,
} from '@mui/material';
import {TabContext, TabList, TabPanel} from '@mui/lab';
import {Swipe, Visibility, VisibilityOff} from '@mui/icons-material';

/* Enter functionality to:
-- update user email
-- turn on/off notifications
-- select which info to get get : " brokers vs paritions " : via toggle button
  -- cluster toggle will on/off ALL information  (fast on)
*/
const NotificationsTab = () => {
  return (
    <Container>
      <Box className="settings default-email">
        <h6>Notifications Email</h6>
        <p>Specify where you would like your email to be sent.</p>
        <TextField label="Default Email" sx={{width: '50%'}} variant="standard" />
      </Box>
      <Box className="settings">
        <h2>Subscriptions</h2>
      </Box>
    </Container>
  );
};

export default NotificationsTab;
