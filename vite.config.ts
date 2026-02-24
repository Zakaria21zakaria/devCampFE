import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Auth + other APIs
      '/v1': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // Client API
      '/client': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
