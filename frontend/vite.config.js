import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for SecureScope frontend
// Proxies /analyze and /health API calls to the FastAPI backend running on port 8000
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/analyze': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
