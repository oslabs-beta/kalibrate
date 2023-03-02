import { createTheme, ThemeOptions } from '@mui/material/styles';

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
  // overrides: {
  //   MuiAppBar: {
  //     colorInherit: {
  //       backgroundColor: '#9db4c0',
  //       color: '#fff',
  //     },
  //   },
  //   MuiButton: {
  //     root: {
  //       background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  //       border: 0,
  //       borderRadius: 3,
  //       boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  //       color: 'white',
  //       height: 48,
  //       padding: '0 30px',
  //     },
  //   },
  // },
  // props: {
  //   MuiAppBar: {
  //     color: 'inherit',
  //   },
  // },
});

export default theme;