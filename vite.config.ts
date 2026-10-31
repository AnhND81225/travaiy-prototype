import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // Cấu hình Proxy chuyển tiếp request /api sang Backend (Spring Boot/NodeJS) tránh CORS ở môi trường Dev
      proxy: {
        '/api': {
          target: process.env.VITE_BACKEND_PROXY_URL || 'http://127.0.0.1:18080',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
