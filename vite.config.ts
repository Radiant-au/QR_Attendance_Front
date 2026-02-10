import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    build: {
      sourcemap: true,
    },
    server: {
      port: 3000,
      https: {
        key: fs.readFileSync('./certs/192.168.110.55+2-key.pem'),
        cert: fs.readFileSync('./certs/192.168.110.55+2.pem'),
      },
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'https://192.168.110.55:8000/api',
          changeOrigin: true,
          secure: false, // Useful if backend cert is self-signed
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
})
