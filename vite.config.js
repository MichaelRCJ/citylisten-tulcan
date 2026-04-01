import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  },
  server: {
    host: true, // Importante para Render
    port: 3000,
    open: true
  },
  preview: {
    host: true,
    port: 3000,
    allowedHosts: ['citylisten-tulcan.onrender.com', 'localhost', '127.0.0.1']
  },
  // Configuración para producción
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
})
