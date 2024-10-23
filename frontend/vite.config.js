import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
import dotenv from 'dotenv';
dotenv.config({ path: '../backend/.env' });

const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: backendUrl,
        changeOrigin: true
      }
    }
  }
})
