import dotenv from 'dotenv';
dotenv.config();

import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

const {PORT} = process.env;

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': `http://localhost:${PORT}`, // proxy for our express server
    },
    open: '/', // open the app on the root path URL
    port: 5712,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'client',
  },
});
