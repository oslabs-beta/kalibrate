import dotenv from 'dotenv';
dotenv.config();

import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

const {PORT} = process.env;

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': `http://localhost:${PORT}`, // proxy for our express server
    },
    port: 5712,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'client',
  },
});
