import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { minifyHtml, injectHtml } from 'vite-plugin-html'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    minifyHtml(),
  ]
})
