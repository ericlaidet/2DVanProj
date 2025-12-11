import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  // ✅ Définit le dossier racine de ton app
  root: path.resolve(__dirname, '.'),

  // ✅ Assure-toi que le dossier public soit bien pris en compte
  publicDir: path.resolve(__dirname, 'public'),

  server: {
    port: 5173,
    open: true,
    fs: {
      // Autorise Vite à servir les fichiers publics du projet
      allow: [path.resolve(__dirname)],
    },
  },

  // ✅ Vitest configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./apps/web/src/setupTests.ts'],
    include: ['apps/*/src/**/*.test.{ts,tsx}'],
    exclude: ['**/tests/**', '**/node_modules/**'],
  },
});
