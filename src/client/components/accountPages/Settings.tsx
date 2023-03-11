import React, {useState} from 'react';
import type {} from '@mui/lab/themeAugmentation';
import {useNavigate} from 'react-router-dom';
import {
  AppBar,
  Container,
  Paper,
  Box,
  Button,
  Typography,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
} from '@mui/material';
import {TabContext, TabList, TabPanel} from '@mui/lab';
import {Swipe, Visibility, VisibilityOff} from '@mui/icons-material';
import AccountTab from './AccountTab';
import NotificationsTab from './NotificationsTab';
import {useTheme} from '@mui/material/styles';
import {tokens} from '../../theme';

const Account = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [value, setValue] = useState<number>(1);
  const handleTab = (event: React.SyntheticEvent, newValue: number): void => {
    setValue(newValue);
  };
  const handleChangeIndex = (index: number) => {
    setValue(index);
  };
  return (
    <Container
      maxWidth="md"
      sx={{
        // height: '100vh'
        display: 'flex',
        paddingY: '100px',
        overflowy: 'scroll',
        backgroundColor: colors.background[500],
        '& .MuiTextField-root': {m: 1, width: '25ch'},
      }}
    >
      <Box sx={{width: '100%'}}>
        <TabContext value={value.toString()}>
          <AppBar position="static" color="inherit">
            <Tabs
              value={value}
              onChange={handleTab}
              variant="fullWidth"
              textColor="inherit"
              indicatorColor="secondary"
            >
              <Tab disableRipple label="Account" value={1} />
              <Tab disableRipple label="Notifications" value={2} />
            </Tabs>
          </AppBar>
          <Paper variant="outlined" sx={{height: '100%', color: 'inherit'}}>
            <TabPanel value="1">
              <AccountTab />
            </TabPanel>
            <TabPanel value="2">
              <NotificationsTab />
            </TabPanel>
          </Paper>
        </TabContext>
      </Box>
    </Container>
  );
};

export default Account;
