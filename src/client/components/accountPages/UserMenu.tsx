import React, {useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, IconButton, Menu, MenuItem, Typography} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import InfoIcon from '@mui/icons-material/Info';
import {ColorModeContext} from '../../theme';
import {UserMenuProps} from '../../types';

const UserMenu = (props: UserMenuProps) => {
  const navigate = useNavigate();

  //manages light/dark mode
  const colorMode = useContext(ColorModeContext);

  //anchorEl: setup to be a toggle, if assigned, will display popover
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const {isAuthenticated, logout} = props;

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (): void => {
    setAnchorElUser(null);
  };

  // clear session data and send back to login/connect page
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/reset', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.err);
      }

      //state clear
      logout();
      navigate('/login'); //if send back to '/', return error bc expecting data
    } catch (err) {
      console.log(err);
    }
  };

  const handleDarkMode = (event: React.ChangeEvent<HTMLInputElement>): void => {
    //set them to dark
    setChecked(event.target.checked);
    colorMode.toggleColorMode();
  };

  return (
    <Box>
      <IconButton
        size="large"
        color="inherit"
        onClick={handleOpenUserMenu}
        sx={{visibility: isAuthenticated ? 'visible' : 'hidden'}}
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
