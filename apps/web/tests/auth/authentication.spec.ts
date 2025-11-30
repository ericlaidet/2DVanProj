// ----------------------------------------------------------------------------
// 4. AUTHENTICATION TESTS (tests/auth/authentication.spec.ts)
// ----------------------------------------------------------------------------
import { test, expect, testUsers } from '../fixtures';

test.describe('Authentication Flow', () => {
  test.use({ storageState: { cookies: [], origins: [] } }); // No auth

  test('successful login redirects to editor', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(testUsers.pro1.email, testUsers.pro1.password);
    
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Plan your Van');
  });

  test('invalid credentials show error', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login('wrong@test.com', 'wrongpassword');
    
    await loginPage.expectLoginError('Identifiants incorrects');
  });

  test('successful registration switches to login', async ({ page, loginPage }) => {
    const uniqueEmail = `test-${Date.now()}@test.com`;
    
    await loginPage.goto();
    await loginPage.register('Test User', uniqueEmail, 'TestPass123!');
    
    await expect(page.locator('text=Compte créé')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible();
  });

  test('duplicate email shows error during registration', async ({ page, loginPage }) => {
    await loginPage.goto();
    await page.getByRole('button', { name: 'Créer un compte' }).click();
    
    // Try to register with existing email
    await page.getByPlaceholder('Nom').fill('Duplicate User');
    await page.getByPlaceholder('Email').fill(testUsers.pro1.email);
    await page.getByPlaceholder('Email').blur();
    
    await loginPage.expectDuplicateError('email');
  });

  test('logout clears token and redirects', async ({ page, loginPage, editorPage }) => {
    await loginPage.goto();
    await loginPage.login(testUsers.pro1.email, testUsers.pro1.password);
    
    await editorPage.clickNavButton('Déconnexion');
    
    await expect(page).toHaveURL('/login');
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeNull();
  });
});
