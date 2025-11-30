// ----------------------------------------------------------------------------
// 13. ERROR HANDLING TESTS (tests/errors/edge-cases.spec.ts)
// ----------------------------------------------------------------------------
import { test, expect } from '../fixtures';

test.describe('Error Handling & Edge Cases', () => {
  
  test('invalid dimensions show error', async ({ page }) => {
    await page.goto('/');
    
    await page.getByPlaceholder('Ex : Table').fill('Invalid Object');
    await page.getByPlaceholder('Ex : 500x300').fill('abc'); // Invalid
    await page.getByRole('button', { name: 'Ajouter' }).click();
    
    await expect(page.locator('text=Dimensions invalides')).toBeVisible();
  });

  test('objects outside workspace boundaries are prevented', async ({ page }) => {
    await page.goto('/');
    
    // Try to add extremely large object
    await page.getByPlaceholder('Ex : Table').fill('Huge Object');
    await page.getByPlaceholder('Ex : 500x300').fill('10000x10000'); // Too large
    await page.getByRole('button', { name: 'Ajouter' }).click();
    
    await expect(page.locator('text=dépasse les dimensions du van')).toBeVisible();
  });

  test('empty plan name shows error', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('button', { name: 'Sauvegarder' }).click();
    await page.getByPlaceholder(/nom/i).fill(''); // Empty
    await page.getByRole('button', { name: 'Confirmer' }).click();
    
    await expect(page.locator('text=nom ne peut pas être vide')).toBeVisible();
  });

  test('API error shows user-friendly message', async ({ page, context }) => {
    // Intercept API and return error
    await context.route('**/plans', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });
    
    await page.goto('/');
    await page.getByRole('button', { name: 'Sauvegarder' }).click();
    await page.getByPlaceholder(/nom/i).fill('Test Plan');
    await page.getByRole('button', { name: 'Confirmer' }).click();
    
    await expect(page.locator('text=Erreur lors de la sauvegarde')).toBeVisible();
  });

  test('network timeout shows retry option', async ({ page, context }) => {
    await context.route('**/plans', (route) => {
      // Delay indefinitely to simulate timeout
      setTimeout(() => route.abort(), 30000);
    });
    
    await page.goto('/');
    await page.getByRole('button', { name: 'Sauvegarder' }).click();
    await page.getByPlaceholder(/nom/i).fill('Test Plan');
    await page.getByRole('button', { name: 'Confirmer' }).click();
    
    await expect(page.locator('text=Délai d\'attente dépassé')).toBeVisible({ timeout: 35000 });
    await expect(page.getByRole('button', { name: 'Réessayer' })).toBeVisible();
  });

  test('expired subscription shows upgrade prompt', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('/');
    
    // Manually set expired subscription
    await page.evaluate(() => {
      localStorage.setItem('subscription', 'FREE');
      localStorage.setItem('subscriptionExpired', 'true');
    });
    
    await page.reload();
    
    // Should show expiration notice
    await expect(page.locator('text=Votre abonnement a expiré')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Renouveler' })).toBeVisible();
    
    await context.close();
  });
});

