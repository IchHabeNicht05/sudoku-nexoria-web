import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <--- Tohle přidej

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <--- A tohle taky
  ],
})