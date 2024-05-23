import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_DEV_API_URL': process.env.VITE_DEV_API_URL,
    'process.env.VITE_PROD_API_URL': process.env.VITE_PROD_API_URL,
  },
   base: '/', // Set the base URL
  server: {
    host: '0.0.0.0', // Set the host
    port: 8338 // Set the port
  }
})
