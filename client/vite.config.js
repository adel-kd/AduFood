import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  resolve: { alias: { '@': '/src' } },
  // Add this for proper routing in production
  build: {
    outDir: 'dist',
  },
  // Optional: Set base path if deploying to subdirectory
  base: process.env.NODE_ENV === 'production' ? '/' : '/'
})