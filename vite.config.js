import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    base: '/AutoConfig/',
    server: {
        port: 3000,
        strictPort: false, // This allows Vite to automatically try the next available port
        open: false
    }
})
