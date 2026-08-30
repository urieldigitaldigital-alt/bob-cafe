import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serves this repo from /bob-cafe/, not the domain root, but
  // Vercel (which sets its own VERCEL env var during build) serves from the
  // domain root — only apply the subpath for a plain `vite build` outside
  // Vercel, and keep the local dev server on "/".
  base: command === 'build' && !process.env.VERCEL ? '/bob-cafe/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: Number(process.env.PORT) || 5173,
  },
}))
