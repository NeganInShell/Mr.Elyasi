import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/andishe-pajoohan/',
  build: {
    chunkSizeWarningLimit: 1000
  }
})
