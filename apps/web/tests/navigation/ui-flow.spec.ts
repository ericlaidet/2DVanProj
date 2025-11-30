// ----------------------------------------------------------------------------
// 11. NAVIGATION & UI TESTS (tests/navigation/ui-flow.spec.ts)
// ----------------------------------------------------------------------------
import { test, expect } from '../fixtures';

test.describe('Navigation & User Interface', () => {
  
  test('displays correct welcome message with user info', async ({ page }) => {
    await page.goto('/');
    
    const userInfo = page.locator('.user-info');
    await expect(userInfo).toContainText('Bienvenue, Pro1 User');
    await expect(userInfo).toContainText('Abonnement: PRO1');
  });

  test('all four navigation buttons are visible', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByRole('button', { name: 'Plans' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Profil' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Paramètres' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Déconnexion' })).toBeVisible();
  });

  test('Plans button shows subscription options', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Plans' }).click();
    
    // Verify all subscription tiers are shown
    await expect(page.locator('text=FREE')).toBeVisible();
    await expect(page.locator('text=PRO1')).toBeVisible();
    await expect(page.locator('text=PRO2')).toBeVisible();
    await expect(page.locator('text=PRO3')).toBeVisible();
    
    // Verify current plan is highlighted
    const currentPlan = page.locator('.plan-card.current');
    await expect(currentPlan).toContainText('PRO1');
  });

  test('Profile button shows user information', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Profil' }).click();
    
    // Verify user details are displayed
    await expect(page.locator('input[name="name"]')).toHaveValue('Pro1 User');
    await expect(page.locator('input[name="email"]')).toHaveValue('pro1-user@test.com');
    await expect(page.locator('text=PRO1')).toBeVisible();
  });

  test('can update username in profile', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Profil' }).click();
    
    const newName = `Updated Name ${Date.now()}`;
    await page.locator('input[name="name"]').fill(newName);
    await page.getByRole('button', { name: 'Enregistrer' }).click();
    
    await expect(page.locator('text=Profil mis à jour')).toBeVisible();
    
    // Verify change reflected in header
    await page.getByRole('button', { name: 'Profil' }).click(); // Close modal
    await expect(page.locator('.user-info')).toContainText(newName);
  });

  test('can update email in profile', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Profil' }).click();
    
    const newEmail = `updated-${Date.now()}@test.com`;
    await page.locator('input[name="email"]').fill(newEmail);
    await page.getByRole('button', { name: 'Enregistrer' }).click();
    
    await expect(page.locator('text=Profil mis à jour')).toBeVisible();
  });

  test('Paramètres shows settings options', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Paramètres' }).click();
    
    // Verify settings are available
    await expect(page.locator('text=Mode sombre')).toBeVisible();
    await expect(page.locator('text=Langue')).toBeVisible();
    await expect(page.locator('text=Devise')).toBeVisible();
  });

  test('toggle dark mode changes theme', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Paramètres' }).click();
    
    const darkModeToggle = page.locator('input[type="checkbox"]', { hasText: 'Mode sombre' });
    await darkModeToggle.check();
    
    // Verify dark theme applied
    const body = page.locator('body');
    await expect(body).toHaveClass(/dark-theme/);
    
    // Toggle back
    await darkModeToggle.uncheck();
    await expect(body).not.toHaveClass(/dark-theme/);
  });

  test('language switch changes UI to English', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Paramètres' }).click();
    
    await page.locator('select[name="language"]').selectOption('english');
    
    // Verify UI changed to English
    await expect(page.locator('h1')).toContainText('Plan your Van');
    await expect(page.getByRole('button', { name: 'Plans' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Profile' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Settings' })).toBeVisible();
  });

  test('currency switch changes symbols', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Paramètres' }).click();
    
    // Switch to dollars
    await page.locator('select[name="currency"]').selectOption('USD');
    
    // Navigate to Plans to see pricing
    await page.getByRole('button', { name: 'Plans' }).click();
    
    // Verify prices show $ instead of €
    const prices = page.locator('.plan-price');
    const firstPrice = await prices.first().textContent();
    expect(firstPrice).toContain('
    );
    expect(firstPrice).not.toContain('€');
  });

  test('settings guide shows instructions', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Paramètres' }).click();
    
    // Click guide section
    await page.locator('text=Guide').click();
    
    // Verify guide content
    await expect(page.locator('text=Comment utiliser l\'interface')).toBeVisible();
    await expect(page.locator('text=Ajouter des objets')).toBeVisible();
    await expect(page.locator('text=Sauvegarder un plan')).toBeVisible();
  });

  test('Déconnexion button is styled correctly', async ({ page }) => {
    await page.goto('/');
    
    const logoutBtn = page.getByRole('button', { name: 'Déconnexion' });
    await expect(logoutBtn).toBeVisible();
    
    // Verify grey background and white text
    const bgColor = await logoutBtn.evaluate((el) => 
      window.getComputedStyle(el).backgroundColor
    );
    const color = await logoutBtn.evaluate((el) => 
      window.getComputedStyle(el).color
    );
    
    expect(bgColor).toContain('128, 128, 128'); // Grey
    expect(color).toContain('255, 255, 255'); // White
  });
});
