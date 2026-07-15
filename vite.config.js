import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const REPO_NAME = 'freela-finder';
const isVercel = process.env.VERCEL === '1';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: isVercel || mode !== 'production' ? '/' : `/${REPO_NAME}/`,
  server: {
    port: 5174,
    proxy: {
      '/api/reddit': {
        target: 'https://www.reddit.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/reddit/, ''),
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
}));
