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
import AccountTab from './AccountTab';
import NotificationsTab from './NotificationsTab';
import MusicPlayerSlider from './musicplayer';

const Account = () => {
  const theme = useTheme();
  const [value, setValue] = useState<string>('');
  const handleTab = (event: React.SyntheticEvent, newValue: string): void => {
    setValue(newValue);
  };
  const handleChangeIndex = (index: number) => {
    setValue(index);
  };
  return (
    <Container
      maxWidth="md"
      sx={{
        height: '100vh',
        display: 'flex',
        paddingY: '100px',
        // justifyContent: 'center',
        // alignItems: 'center',
        overflowy: 'scroll',
        backgroundColor: 'pink',
        '& .MuiTextField-root': {m: 1, width: '25ch'},
      }}
    >
      <Box sx={{width: '100%'}}>
        <TabContext value={value}>
          <AppBar position="static">
            <TabList value={value} onChange={handleTab} variant="fullWidth">
              <Tab label="Account" value="1" />
              <Tab label="Notifications" value="2" />
              <Tab label="Fun" value="3" />
            </TabList>
          </AppBar>
          <Paper variant="outlined" elevation={3} sx={{height: '100%'}}>
            <TabPanel value="1">
              <AccountTab />
            </TabPanel>
            <TabPanel value="2">
              <NotificationsTab />
            </TabPanel>
            <TabPanel value="3">
              <MusicPlayerSlider />
            </TabPanel>
          </Paper>
        </TabContext>
      </Box>
    </Container>
  );
};

export default Account;
