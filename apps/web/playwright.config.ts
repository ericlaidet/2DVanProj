// apps/web/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  /* Timeout par test */
  timeout: 60000,

  /* Retry en cas d'échec */
  retries: process.env.CI ? 2 : 0,

  /* Workers - 1 seul en CI pour éviter les conflits */
  workers: process.env.CI ? 1 : undefined,

  /* Configuration globale */
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Configuration du serveur Web */
  webServer: process.env.CI ? {
    // ✅ En CI: Playwright démarre Vite automatiquement
    command: 'npm run dev:web',
    url: 'http://localhost:5173',
    reuseExistingServer: false, // Ne pas réutiliser car on veut un serveur propre
    timeout: 120 * 1000,
  } : {
    // ✅ En local: Réutiliser le serveur s'il existe déjà
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },

  /* Projects - Navigateurs */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Reporters */
  reporter: process.env.CI
    ? [['html', { outputFolder: 'playwright-report', open: 'never' }], ['github']]
    : [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
});
