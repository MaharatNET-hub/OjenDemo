import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Base path matches the GitHub Pages project site (https://<org>.github.io/OjenDemo/)
export default defineConfig({
  base: '/OjenDemo/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
