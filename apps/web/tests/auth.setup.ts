// ----------------------------------------------------------------------------
// 3. AUTHENTICATION SETUP (tests/auth.setup.ts)
// ----------------------------------------------------------------------------
import { test as setup, expect } from '@playwright/test';
import { testUsers } from './fixtures';

const authFile = 'tests/.auth/user.json';

setup('authenticate as PRO1 user', async ({ page, request }) => {
  // Create user via API if doesn't exist
  try {
    await request.post('/auth/register', {
      data: testUsers.pro1
    });
  } catch (error) {
    console.log('User already exists, proceeding to login');
  }

  // Login via UI
  await page.goto('/login');
  await page.getByPlaceholder('Email').fill(testUsers.pro1.email);
  await page.getByPlaceholder('Mot de passe').fill(testUsers.pro1.password);
  await page.getByRole('button', { name: 'Se connecter' }).click();

  // Wait for authentication
  await page.locator('text=Connexion réussie').waitFor();
  await page.waitForURL('/');

  // Verify token in localStorage
  const token = await page.evaluate(() => localStorage.getItem('token'));
  expect(token).toBeTruthy();

  // Save authenticated state
  await page.context().storageState({ path: authFile });
});
