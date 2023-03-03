import {createTheme, ThemeOptions} from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#9db4c0',
    },
    secondary: {
      main: '#c2dfe3',
    },
    background: {
      default: '#f5f5f5',
      paper: '#f5f5f5',
    },
    error: {
      main: '#e17160',
    },
    warning: {
      main: '#d32f2f',
    },
    info: {
      main: '#253237',
    },
  },
  typography: {
    fontSize: 14,
    fontFamily: 'Source Sans Pro',
  },
});

export default theme;
