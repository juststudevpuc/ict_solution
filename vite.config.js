import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  plugins: [react(), tailwindcss()],
  esbuild: {
    drop: ['console', 'debugger'],
  },
  server: {
    // THIS IS THE FIX: The Local Middleman
    proxy: {
      '/api': {
        target: 'http://54.179.48.141',
        changeOrigin: true,
      },
      '/sanctum': {
        target: 'http://54.179.48.141',
        changeOrigin: true,
      }
    }
  }
})

