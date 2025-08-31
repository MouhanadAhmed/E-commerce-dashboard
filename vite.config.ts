import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    port: 9000, // Change this to your desired port number
  },
  build: {
    chunkSizeWarningLimit: 3000,
  },
  
})
