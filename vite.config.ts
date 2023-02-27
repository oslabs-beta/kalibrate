import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5173', // proxy for our express server
    },
    open: '/', // open the app on the root path URL
    port: 5712,
  },
});
