import {useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  Button,
  Badge,
  Menu,
  MenuItem,
  Switch,
  FormGroup,
  FormControlLabel,
  MenuList,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import crow from './assets/crow2.png';
import UserMenu from './accountPages/UserMenu';
import {ColorModeContext, tokens} from '../theme';

interface NavbarProps {
  isAuthenticated: boolean;
  isConnected?: boolean;
  logout: () => void;
  alerts: string[];
  setAlerts: (alerts: string[]) => void;
}

// Render navbar at top of page
const Navbar = (props: NavbarProps) => {
  const pages = ['Dashboard'];

  const navigate = useNavigate();
  const {isAuthenticated, isConnected, logout, alerts, setAlerts} = props;
  const [anchorElAlerts, setAnchorElAlerts] = useState<null | HTMLElement>(null);
  //manges light/dark mode
  const [checked, setChecked] = useState<boolean>(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const handleOpenAlertsMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElAlerts(event.currentTarget);
  };

  const handleCloseAlertsMenu = (): void => {
    setAnchorElAlerts(null);
  };

  const handleClearAlerts = () => {
    setAlerts([]);
  };

  const handleDarkMode = (): void => {
    //set them to dark
    setChecked(true);
    colorMode.toggleColorMode();
  };
  return (
    <AppBar position="static">
      <Container
        maxWidth={false}
        sx={{
          position: 'fixed',
          zIndex: theme => theme.zIndex.drawer + 1,
          width: '100vw',
          bgcolor: colors.primary[400],
        }}
      >
        <Toolbar disableGutters>
          <div className="logo">
            <Typography noWrap sx={{display: {xs: 'none', md: 'flex'}}}>
              <img src={crow} width="35"></img>
            </Typography>
          </div>
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={() => navigate('/')}
            sx={{
              mr: 2,
              display: {xs: 'none', md: 'flex'},
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            KALIBRATE
          </Typography>
          <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
            {pages.map(page => (
              <Button
                key={page}
                onClick={() => navigate('/dashboard')}
                sx={{
                  my: 2,
                  color: 'inherit',
                  display: 'block',
                  m: 0,
                  visibility: isAuthenticated ? 'visible' : 'hidden',
                }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <MenuItem>
            {' '}
            <IconButton color="inherit" onClick={handleDarkMode}>
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </MenuItem>
          {/* when Alerts icon is clicked, display popover menu containing alerts from anchorEl */}
          <IconButton
            size="large"
            color="inherit"
            onClick={handleOpenAlertsMenu}
            sx={{visibility: isAuthenticated ? 'visible' : 'hidden'}}
          >
            <Badge badgeContent={alerts.length} color="error">
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
            <MenuItem
              onClick={handleClearAlerts}
              sx={{width: '400px', maxHeight: '50vh', overflow: 'auto'}}
            >
              <ListItemIcon>
                <ClearIcon />
              </ListItemIcon>
              <ListItemText>Clear all alerts</ListItemText>
            </MenuItem>
            <Divider />
            {alerts.length ? (
              alerts.map(alert => (
                <MenuItem key={alert}>
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText>{alert}</ListItemText>
                </MenuItem>
              ))
            ) : (
              <MenuItem>
                <ListItemText>No active alerts...</ListItemText>
              </MenuItem>
            )}
          </Menu>
          {/* when Settings icon is clicked, display settings menu containing elements from anchorEl */}
          <UserMenu isAuthenticated={isAuthenticated} logout={logout} />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
