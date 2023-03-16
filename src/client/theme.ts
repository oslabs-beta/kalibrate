import {createContext, useState, useMemo} from 'react';
import {createTheme} from '@mui/material/styles';

// export default theme;
export const tokens = (mode: string) => ({
  ...(mode === 'light'
    ? {
        //--dark cyan
        primary: {
          100: '#EDF6F9',
          200: '#87e6f9',
          300: '#57dbf5',
          400: '#35d3f1',
          500: '#23caed',
          600: '#1ebad8',
          700: '#16a4bd',
          800: '#0f90a4',
          900: '#006d77',
        },
        //--lighter cyan
        secondary: {
          100: '#b3dbd8',
          200: '#83c5be',
          300: '#53aea5',
          400: '#319d92',
          500: '#178d7f',
          600: '#158073',
          700: '#127063',
          800: '#0f6155',
          900: '#09453a',
        },
        //--white
        background: {
          100: '#fefefe',
          200: '#fefefe',
          300: '#fdfdfd',
          400: '#fdfdfd',
          500: '#fcfcfc',
          600: '#cacaca',
          700: '#979797',
          800: '#656565',
          900: '#323232',
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
          100: '#212529bf',
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
        accent: {
          100: '#140a1f',
          200: '#29143d',
          300: '#3d1f5c',
          400: '#52297a',
          500: '#663399',
          600: '#855cad',
          700: '#a385c2',
          800: '#c2add6',
          900: '#e0d6eb',
        },
      }
    : {
        primary: {
          100: '#191d1f',
          200: '#323a3e',
          300: '#4c565c',
          400: '#65737b',
          500: '#7e909a',
          600: '#9db4c0',
          700: '#b2bcc2',
          800: '#cbd3d7',
          900: '#006d77',
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
        white: {
          100: '#323232',
          200: '#656565',
          300: '#979797',
          400: '#cacaca',
          500: '#fcfcfc',
          600: '#fdfdfd',
          700: '#fdfdfd',
          800: '#fefefe',
          900: '#fefefe',
        },
        background: {
          100: '#060505',
          200: '#0b0b0b',
          300: '#111010',
          400: '#161616',
          500: '#292828',
          600: '#494949',
          700: '#777676',
          800: '#a4a4a4',
          900: '#d2d1d1',
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
          100: '#899ba3',
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
        accent: {
          100: '#e0d6eb',
          200: '#c2add6',
          300: '#a385c2',
          400: '#855cad',
          500: '#663399',
          600: '#52297a',
          700: '#3d1f5c',
          800: '#29143d',
          900: '#140a1f',
        },
      }),
});

export const themeSettings = (mode: any) => {
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
