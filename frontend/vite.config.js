import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'  // proxy API requests to Flask backend
    }
  },
  base: '/static/frontend/',                // assets will be served from /static/frontend/
  build: {
    outDir: '../backend/website/static/frontend', // put built files in Flask static
    emptyOutDir: true,
  }
})
