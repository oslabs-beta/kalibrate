import React, {useState, useEffect} from 'react';
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
  FormGroup,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {TabContext, TabList, TabPanel} from '@mui/lab';
import {Swipe, Visibility, VisibilityOff} from '@mui/icons-material';
import {NotificationsProps} from '../../types';

/* Enter functionality to:
-- update user email
-- turn on/off notifications
-- select which info to get get : " brokers vs paritions " : via toggle button
  -- cluster toggle will on/off ALL information  (fast on)
*/
const NotificationsTab = (props: NotificationsProps) => {
  const {isAlertEnabled, setIsAlertEnabled} = props; // ref obj that needs to be mutated for poll

  // controlled state for form
  const [isConsumerGroupStatusToggled, setIsConsumerGroupStatusToggled] = useState<boolean>(false);

  // toggle alerts for consumer group status
  const handleConsumerGroupStatusToggle = () => {
    const newSwitchValue = !isConsumerGroupStatusToggled;

    isAlertEnabled.consumerGroupStatus = newSwitchValue; // for poll
    setIsConsumerGroupStatusToggled(newSwitchValue); // for form
  };

  return (
    <Container>
      <Box className="settings">
        <h2>Enable Alerts</h2>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={isConsumerGroupStatusToggled}
                onChange={handleConsumerGroupStatusToggle}
              />
            }
            label="Consumer Group Status Changes"
          />
        </FormGroup>
      </Box>
      <Box className="settings default-email">
        <h2>Enable Integrations</h2>
        <h5>Email</h5>
        <p>Specify where you would like your email to be sent.</p>
        <TextField label="Default Email" sx={{width: '50%'}} variant="standard" />
      </Box>
    </Container>
  );
};

export default NotificationsTab;
