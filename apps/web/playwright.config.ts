// ============================================================================
// PLAYWRIGHT TEST SUITE - VAN PLANNER APPLICATION
// Complete E2E Testing Implementation with Best Practices
// ============================================================================

// ----------------------------------------------------------------------------
// 1. TEST CONFIGURATION (playwright.config.ts)
// ----------------------------------------------------------------------------
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  
  use: {
    baseURL: process.env.VITE_API_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
  },

  projects: [
    // Setup project to authenticate once
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    { name: 'UnitTest', testMatch: /.*\.unittest\.ts/ },
    
    // Tests that require authentication
    {
      name: 'authenticated',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'tests/.auth/user.json'
      },
      dependencies: ['setup'],
    },
    
    // Tests without authentication
    {
      name: 'guest',
      use: { ...devices['Desktop Chrome'] },
    },
    
    // Mobile tests
    {
      name: 'mobile',
      use: { 
        ...devices['iPhone 13'],
        storageState: 'tests/.auth/user.json'
      },
      dependencies: ['setup'],
    },
    // Other tests
    {
      name: 'Other',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'tests/.auth/user.json'
      },
      dependencies: ['setup'],
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
