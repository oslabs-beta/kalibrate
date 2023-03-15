import {useState} from 'react';
import {
  Container,
  Box,
  Button,
  Typography,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
  Alert,
} from '@mui/material';
import {NotificationsProps} from '../../types';

const NotificationsTab = (props: NotificationsProps) => {
  const {
    isAlertEnabled,
    setIsAlertEnabled,
    savedURIs,
    setSavedURIs,
    isSlackError,
    setIsSlackError,
  } = props;

  // controlled state for form
  const [isConsumerGroupStatusToggled, setIsConsumerGroupStatusToggled] = useState<boolean>(
    isAlertEnabled.consumerGroupStatus
  );
  const [localSlackURI, setLocalSlackURI] = useState<string>('');

  const handleSlackUriSave = () => {
    if (localSlackURI) {
      const newSavedURIs = savedURIs;
      setSavedURIs({...savedURIs, slackURI: localSlackURI}); // set state for form
      newSavedURIs.slackURI = localSlackURI; // mutate for poll
    }
  };

  const handleSlackUriClear = () => {
    const newSavedURIs = savedURIs;
    setSavedURIs({...savedURIs, slackURI: ''}); // set state for form
    newSavedURIs.slackURI = ''; // mutate for poll

    setLocalSlackURI('');
    setIsSlackError(false);
  };

  // toggle alerts for consumer group status
  const handleConsumerGroupStatusToggle = () => {
    const newSwitchValue = !isConsumerGroupStatusToggled;
    isAlertEnabled.consumerGroupStatus = newSwitchValue; // mutate for poll
    setIsConsumerGroupStatusToggled(newSwitchValue); // set state for form
    setIsAlertEnabled({...isAlertEnabled, consumerGroupStatus: newSwitchValue});
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

        {/* Slack integration */}
        <Typography variant="h6">Slack</Typography>
        <Box
          sx={{
            display: 'flex',
            '& .css-1amac0x-MuiContainer-root': {width: '100%'},
            '& .MuiTextField-root': {width: '100%'},
          }}
        >
          <TextField
            label="Slack Webhook URI"
            variant="standard"
            value={savedURIs.slackURI ? savedURIs.slackURI : localSlackURI}
            onChange={e => setLocalSlackURI(e.target.value)}
            disabled={!!savedURIs.slackURI}
          />

          <Button disabled={!!savedURIs.slackURI || !localSlackURI} onClick={handleSlackUriSave}>
            Save
          </Button>

          <Button disabled={!savedURIs.slackURI} onClick={handleSlackUriClear}>
            Clear
          </Button>
        </Box>

        {isSlackError && (
          <Alert severity="error">
            Error occured while sending slack alert, please verify that provided URI is valid
          </Alert>
        )}

        {/* Email integration */}
      </Box>
    </Container>
  );
};

export default NotificationsTab;
