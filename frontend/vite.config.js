import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/inventory': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/cart': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/order': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
    }
  }
})
