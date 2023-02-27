import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import {useState, SyntheticEvent} from 'react';
import {useNavigate, Link} from 'react-router-dom';

interface Props {
  isConnected: boolean
}

const Navbar = (props: Props) => {
  const pages = ['Dashboard'];
  const settings = ['Account'];
  const alerts = ['Alert 1', 'Alert 2'];
  
  const navigate = useNavigate();
  // const [value, setValue] = useState<number>(0);
  // const handleChange = (event: SyntheticEvent, newValue: number) => {
  //   setValue(newValue);
  // };
  const {isConnected} = props;
  console.log('isConnected', isConnected);
  const [anchorElAlerts, setAnchorElAlerts] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenAlertsMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElAlerts(event.currentTarget);
  };

  const handleCloseAlertsMenu = (): void => {
    setAnchorElAlerts(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (): void => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container
        maxWidth={false}
        sx={{
          position: 'fixed',
          zIndex: theme => theme.zIndex.drawer + 1,
          width: '100vw',
          bgcolor: 'skyblue',
        }}
      >
        <Toolbar disableGutters>
          {/* link kalibrate logo to home page */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: {xs: 'none', md: 'flex'},
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            KALIBRATE
          </Typography>
          
          {/* link dashboard button to dashboard page */}
          <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
            {pages.map(page => (
              <Button
                key={page}
                onClick={() => navigate('/dashboard')}
                sx={{my: 2, color: 'white', display: 'block', m: 0, visibility: isConnected ? 'visible' : 'hidden'}}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* when Alerts icon is clicked, connect popover menu to alerts element via anchorEl */}
          <IconButton size="large" color="inherit" onClick={handleOpenAlertsMenu} sx={{visibility: isConnected ? 'visible' : 'hidden'}}>
            <Badge badgeContent={2} color="error">
              <NotificationsIcon aria-label="notification" />
            </Badge>
          </IconButton>
          <Menu
            sx={{mt: '30px'}}
            id="alerts-menu"
            anchorEl={anchorElAlerts}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElAlerts)}
            onClose={handleCloseAlertsMenu}
          >
            {alerts.map(alert => (
              <MenuItem key={alert} onClick={handleCloseAlertsMenu}>
                <Typography textAlign="center">{alert}</Typography>
              </MenuItem>
            ))}
          </Menu>

          {/* when Settings icon is clicked, connect popover menu to settings element via anchorEl */}
          <IconButton size="large" color="inherit" onClick={handleOpenUserMenu} sx={{visibility: isConnected ? 'visible' : 'hidden'}}>
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
            {settings.map(setting => (
              <MenuItem key={setting} onClick={handleCloseUserMenu}>
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;

{
  /* <Box
  position="fixed"
  sx={{zIndex: theme => theme.zIndex.drawer + 1, width: '100vw', bgcolor: 'skyblue'}}
>
  <Tabs
    value={value}
    onChange={handleChange}
    aria-label="nav tabs"
    TabIndicatorProps={{
      style: {background: 'none'},
    }}
  >
    <Link to="/" style={{color: 'inherit'}}>
      <Tab label="Kalibrate" />
    </Link>
    <Link to="/dashboard" style={{textDecoration: 'none', color: 'inherit'}}>
      <Tab label="Dashboard" />
    </Link>
    <Link to="/alerts" style={{textDecoration: 'none', color: 'inherit'}}>
      <IconButton size="large" color="inherit">
        <Badge badgeContent={4} color="error">
          <NotificationsIcon aria-label="notification" />
        </Badge>
      </IconButton>
    </Link> */
}

{
  /* when Settings is clicked, connect popover menu to settings element via anchorEl */
}
{
  /* <IconButton size="large" color="inherit" onClick={handleOpenUserMenu}>
      <SettingsIcon aria-label="settings" />
    </IconButton>
    <Menu
      sx={{mt: '25px'}}
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
      {settings.map(setting => (
        <MenuItem key={setting} onClick={handleCloseUserMenu}>
          <Typography textAlign="center">{setting}</Typography>
        </MenuItem>
      ))}
    </Menu>
  </Tabs>
</Box> */
}
