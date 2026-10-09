/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const backend = 'http://localhost:8080'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // U razvoju frontend i backend izgledaju kao ista domena (kao iza Caddyja u produkciji)
    proxy: {
      '/api': backend,
      '/oauth2': backend,
      '/login/oauth2': backend,
      '/actuator': backend,
    },
  },
  test: {
    environment: 'jsdom',
  },
})
