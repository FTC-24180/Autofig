import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'

// Read version from version.js at build time
const versionFile = readFileSync('./public/version.js', 'utf-8');
const versionMatch = versionFile.match(/VERSION = '([^']+)'/);
const VERSION = versionMatch ? versionMatch[1] : '0.0.0';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Root path for custom domain
  server: {
    port: 3000,
    strictPort: false, // This allows Vite to automatically try the next available port
    open: false
  },
  define: {
    '__APP_VERSION__': JSON.stringify(VERSION)
  }
})
