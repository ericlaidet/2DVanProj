// ----------------------------------------------------------------------------
// 5. SUBSCRIPTION TESTS (tests/subscriptions/account-types.spec.ts)
// ----------------------------------------------------------------------------
import { test, expect, testUsers } from '../fixtures';

test.describe('Subscription Account Types', () => {
  
  test('FREE account shows correct limitations', async ({ page, context }) => {
    // Login as FREE user
    const freeContext = await context.browser()?.newContext();
    const freePage = await freeContext!.newPage();
    
    await freePage.goto('/login');
    await freePage.getByPlaceholder('Email').fill(testUsers.free.email);
    await freePage.getByPlaceholder('Mot de passe').fill(testUsers.free.password);
    await freePage.getByRole('button', { name: 'Se connecter' }).click();
    
    await freePage.waitForURL('/');
    
    // Check subscription displayed
    await expect(freePage.locator('text=Abonnement: FREE')).toBeVisible();
    
    // Check AI prompt section is disabled
    const promptSection = freePage.locator('.van-section.prompt');
    await expect(promptSection).toHaveAttribute('data-disabled', 'true');
    
    // Check "Optimiser" button is disabled
    const optimizeBtn = freePage.getByRole('button', { name: 'Optimiser' });
    await expect(optimizeBtn).toBeDisabled();
    
    await freeContext!.close();
  });

  test('PRO1 account has 3 van limit', async ({ page, editorPage }) => {
    // Verify can create up to 3 plans
    for (let i = 1; i <= 3; i++) {
      await editorPage.savePlan(`Plan ${i}`);
      await editorPage.expectPlanInList(`Plan ${i}`);
    }
    
    // Try to create 4th plan - should show upgrade modal
    await page.getByRole('button', { name: 'Sauvegarder' }).click();
    await expect(page.locator('text=Limite atteinte')).toBeVisible();
    await expect(page.locator('text=Abonnement Pro')).toBeVisible();
  });

  test('PRO2 account has Optimiser button enabled', async ({ page, context }) => {
    // Login as PRO2 user
    await page.goto('/login');
    await page.getByPlaceholder('Email').fill(testUsers.pro2.email);
    await page.getByPlaceholder('Mot de passe').fill(testUsers.pro2.password);
    await page.getByRole('button', { name: 'Se connecter' }).click();
    
    await page.waitForURL('/');
    
    // Check "Optimiser" button is enabled
    const optimizeBtn = page.getByRole('button', { name: 'Optimiser' });
    await expect(optimizeBtn).toBeEnabled();
  });

  test('upgrade flow shows payment options', async ({ page, editorPage }) => {
    await editorPage.clickNavButton('Plans');
    
    // Click upgrade to PRO2
    await page.getByRole('button', { name: /PRO2/ }).click();
    
    // Check Stripe/PayPal options appear
    await expect(page.locator('text=Stripe')).toBeVisible();
    await expect(page.locator('text=PayPal')).toBeVisible();
  });
});

