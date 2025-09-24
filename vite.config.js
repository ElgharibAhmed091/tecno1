import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),  // Alias for cleaner imports
    },
  },
  server: {
    host: "localhost",  // Ensures it runs on localhost
    port: 5173,         // Default Vite port
    cors: true,         // Enables CORS
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",  // Django backend URL
        changeOrigin: true,
        secure: false,  // Disable SSL verification for local dev
        rewrite: (path) => path.replace(/^\/api/, ""),  // Removes `/api` prefix
      },
    },
  },
});
