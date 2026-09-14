import { execFileSync } from 'node:child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const copyScript = path.join(__dirname, '../scripts/copy-frontend-to-public.mjs')

function copyFrontendToPublicPlugin(): Plugin | null {
  if (process.env.COPY_TO_PUBLIC !== '1') {
    return null
  }

  return {
    name: 'copy-frontend-to-public',
    closeBundle() {
      execFileSync(process.execPath, [copyScript], { stdio: 'inherit' })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), copyFrontendToPublicPlugin()].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor'
          }
          if (id.includes('@tanstack/react-query')) {
            return 'query'
          }
          if (id.includes('react-helmet-async')) {
            return 'helmet'
          }
        },
      },
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    hmr: process.env.VITE_HMR_HOST
      ? {
          host: process.env.VITE_HMR_HOST,
          clientPort: Number(process.env.VITE_DEV_PORT ?? 5173),
        }
      : undefined,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/sanctum': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://127.0.0.1:5174',
        changeOrigin: true,
      },
    },
  },
})
