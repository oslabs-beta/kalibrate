import {createContext, useState, useMemo} from 'react';
import {createTheme, ThemeOptions} from '@mui/material/styles';
import {PaletteMode} from '@mui/material';
type mode = string;

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

// export default theme;

export const tokens = (mode: PaletteMode) => ({
  ...(mode === 'light'
    ? {
        //--blue
        primary: {
          100: '#ebf0f2',
          200: '#d8e1e6',
          300: '#c4d2d9',
          400: '#b1c3cd',
          500: '#9db4c0',
          600: '#7e909a',
          700: '#5e6c73',
          800: '#3f484d',
          900: '#1f2426',
        },
        //--lighterblue
        secondary: {
          100: '#f3f9f9',
          200: '#e7f2f4',
          300: '#daecee',
          400: '#cee5e9',
          500: '#c2dfe3',
          600: '#9bb2b6',
          700: '#748688',
          800: '#4e595b',
          900: '#272d2d',
        },
        //--white
        background: {
          100: '#fdfdfd',
          200: '#fbfbfb',
          300: '#f9f9f9',
          400: '#f7f7f7',
          500: '#f5f5f5',
          600: '#c4c4c4',
          700: '#939393',
          800: '#626262',
          900: '#313131',
        },
        //--error
        redError: {
          100: '#f9e3df',
          200: '#f3c6bf',
          300: '#edaaa0',
          400: '#e78d80',
          500: '#e17160',
          600: '#b45a4d',
          700: '#87443a',
          800: '#5a2d26',
          900: '#2d1713',
        },
        redWarning: {
          100: '#f6d5d5',
          200: '#edacac',
          300: '#e58282',
          400: '#dc5959',
          500: '#d32f2f',
          600: '#a92626',
          700: '#7f1c1c',
          800: '#541313',
          900: '#2a0909',
        },
        //--darkestBlue
        info: {
          100: '#d3d6d7',
          200: '#a8adaf',
          300: '#7c8487',
          400: '#515b5f',
          500: '#253237',
          600: '#1e282c',
          700: '#161e21',
          800: '#0f1416',
          900: '#070a0b',
        },
        //manageBlue
        manage: {
          100: '#fbfeff',
          200: '#f8fcff',
          300: '#f4fbfe',
          400: '#f1f9fe',
          500: '#edf8fe',
          600: '#bec6cb',
          700: '#8e9598',
          800: '#5f6366',
          900: '#2f3233',
        },
      }
    : {
        primary: {
          100: '#1f2426',
          200: '#3f484d',
          300: '#5e6c73',
          400: '#7e909a',
          500: '#9db4c0',
          600: '#b1c3cd',
          700: '#c4d2d9',
          800: '#d8e1e6',
          900: '#ebf0f2',
        },
        secondary: {
          100: '#272d2d',
          200: '#4e595b',
          300: '#748688',
          400: '#9bb2b6',
          500: '#c2dfe3',
          600: '#cee5e9',
          700: '#daecee',
          800: '#e7f2f4',
          900: '#f3f9f9',
        },
        background: {
          100: '#d2d1d1',
          200: '#a4a4a4',
          300: '#777676',
          400: '#494949',
          500: '#292828',
          600: '#161616',
          700: '#111010',
          800: '#0b0b0b',
          900: '#060505',
        },
        redError: {
          100: '#2d1713',
          200: '#5a2d26',
          300: '#87443a',
          400: '#b45a4d',
          500: '#e17160',
          600: '#e78d80',
          700: '#edaaa0',
          800: '#f3c6bf',
          900: '#f9e3df',
        },
        redWarning: {
          100: '#2a0909',
          200: '#541313',
          300: '#7f1c1c',
          400: '#a92626',
          500: '#d32f2f',
          600: '#dc5959',
          700: '#e58282',
          800: '#edacac',
          900: '#f6d5d5',
        },
        info: {
          100: '#070a0b',
          200: '#0f1416',
          300: '#161e21',
          400: '#1e282c',
          500: '#253237',
          600: '#515b5f',
          700: '#7c8487',
          800: '#a8adaf',
          900: '#d3d6d7',
        },
        manage: {
          100: '#090a0a',
          200: '#131414',
          300: '#1c1e1f',
          400: '#262829',
          500: '#2f3233',
          600: '#595b5c',
          700: '#828485',
          800: '#acadad',
          900: '#d5d6d6',
        },
      }),
});

export const themeSettings = mode => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === 'light'
        ? {
            palette: {
              mode: 'light',
              primary: {
                main: colors.primary[500],
              },
              secondary: {
                main: colors.secondary[500],
              },
              background: {
                default: colors.background[500],
                paper: colors.background[500],
              },
              error: {
                main: colors.redError[500],
              },
              warning: {
                main: colors.redWarning[500],
              },
              info: {
                main: colors.info[500],
              },
            },
            typography: {
              fontSize: 14,
              fontFamily: 'Source Sans Pro',
            },
          }
        : {
            palette: {
              mode: 'dark',
              primary: {
                main: colors.primary[500],
              },
              secondary: {
                main: colors.secondary[500],
              },
              background: {
                default: colors.background[100],
                paper: colors.background[100],
              },
              error: {
                main: colors.redError[500],
              },
              warning: {
                main: colors.redWarning[500],
              },
              info: {
                main: colors.info[100],
              },
            },
            typography: {
              fontSize: 14,
              fontFamily: 'Source Sans Pro',
            },
          }),
    },
  };
};

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState('light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => setMode(prev => (prev === 'light' ? 'dark' : 'light')),
    }),
    []
  );
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
