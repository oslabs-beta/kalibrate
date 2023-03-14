import React from 'react';
import ReactDOM from 'react-dom/client';
import './stylesheets/style.scss';
import App from './App';
import {ThemeProvider} from '@mui/material/styles';
import theme from './theme';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
