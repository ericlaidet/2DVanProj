import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '../..'));

  return {
    plugins: [react()],
    define: { 'process.env': env },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: { port: 5173, open: true },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: path.resolve(__dirname, '../../tests/setup/test-setup.ts'),
      css: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        reportsDirectory: path.resolve(__dirname, '../../coverage'),
      },
    },
  };
});
