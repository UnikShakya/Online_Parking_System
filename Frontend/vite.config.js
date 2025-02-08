import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5174,
    hmr: {
      protocol: 'ws',
    },
    proxy: {
      '/api': 'http://localhost:5000',  // Proxying requests to your backend API
    },
  },
});
