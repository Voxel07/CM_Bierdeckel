import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
   base: '/', // Set the base URL
  server: {
    host: '0.0.0.0', // Set the host
    port: 9001 // Set the port
  }
})
