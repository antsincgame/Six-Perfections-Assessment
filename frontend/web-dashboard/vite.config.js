import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ॐ गते गते पारगते पारसंगते बोधि स्वाहा
// Green Tara's Vite Configuration for Pure Enlightenment

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  },
  preview: {
    port: 4173,
    host: true
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
}) 