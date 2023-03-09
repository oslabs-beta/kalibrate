import React, {useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Switch,
  FormGroup,
  FormControlLabel,
  useTheme,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import InfoIcon from '@mui/icons-material/Info';
import {DarkMode, Info} from '@mui/icons-material';
import {Props} from '../Navbar';
import {ColorModeContext, tokens} from '../../theme';

const UserMenu = (props: Props) => {
  const navigate = useNavigate();
  //manges light/dark mode
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  //anchorEl: setup to be a toggle, if assigned, will display popover
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [checked, setChecked] = useState<boolean>(true);
  const {isConnected, logout} = props;

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = (): void => {
    setAnchorElUser(null);
  };

  //end goal: should clear session data and send back to login/connect page
  const handleLogout = async () => {
    console.log('TRYING TO LOG OUT');
    await logout();
    console.log(isConnected);
    await navigate('/login'); //if send back to '/', return error bc expecting data... async problem?
  };
  const handleDarkMode = (event: React.ChangeEvent<HTMLInputElement>): void => {
    //set them to dark
    setChecked(event.target.checked);
    colorMode.toggleColorMode();
    console.log('THEME SET', checked);
  };
  return (
    <Box>
      <IconButton
        size="large"
        color="inherit"
        onClick={handleOpenUserMenu}
        sx={{visibility: isConnected ? 'visible' : 'hidden'}}
      >
        <SettingsIcon aria-label="settings" />
      </IconButton>
      <Menu
        sx={{mt: '30px'}}
        id="settings-menu"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem key={'darkmode'}>
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={checked} onChange={handleDarkMode} />}
              label="Dark Mode"
              labelPlacement="start"
            />
          </FormGroup>
        </MenuItem>
        <MenuItem key={'account'} onClick={() => navigate('settings')}>
          <ManageAccountsOutlinedIcon />
          <Typography textAlign="center">Account</Typography>
        </MenuItem>
        <MenuItem>
          <InfoIcon />
          <Typography>About Kalibrate</Typography>
        </MenuItem>
        <hr />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon />
          <Typography>Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};
export default UserMenu;
