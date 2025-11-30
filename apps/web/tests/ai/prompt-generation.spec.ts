// ----------------------------------------------------------------------------
// 10. AI FEATURES TESTS (tests/ai/prompt-generation.spec.ts)
// ----------------------------------------------------------------------------
import { test, expect, testUsers } from '../fixtures';

test.describe('AI-Powered Layout Generation', () => {
  
  test('FREE account sees disabled AI prompt section', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('/login');
    await page.getByPlaceholder('Email').fill(testUsers.free.email);
    await page.getByPlaceholder('Mot de passe').fill(testUsers.free.password);
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await page.waitForURL('/');
    
    // AI section should be disabled
    const promptSection = page.locator('.van-section.prompt');
    await expect(promptSection).toHaveAttribute('data-disabled', 'true');
    
    // Generate button should show upgrade message
    await page.getByRole('button', { name: 'Générer layout' }).click();
    await expect(page.locator('text=Fonctionnalité réservée aux abonnés Pro')).toBeVisible();
    
    await context.close();
  });

  test('PRO1 can generate layout but not optimize', async ({ page }) => {
    // PRO1 is default authenticated user
    await page.goto('/');
    
    // Générer layout should be enabled
    const generateBtn = page.getByRole('button', { name: 'Générer layout' });
    await expect(generateBtn).toBeEnabled();
    
    // Optimiser should be disabled
    const optimizeBtn = page.getByRole('button', { name: 'Optimiser' });
    await expect(optimizeBtn).toBeDisabled();
    await expect(optimizeBtn).toHaveAttribute('title', /PRO2 ou PRO3/);
  });

  test('PRO2 can optimize existing layout', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('/login');
    await page.getByPlaceholder('Email').fill(testUsers.pro2.email);
    await page.getByPlaceholder('Mot de passe').fill(testUsers.pro2.password);
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await page.waitForURL('/');
    
    // Both buttons should be enabled
    const generateBtn = page.getByRole('button', { name: 'Générer layout' });
    const optimizeBtn = page.getByRole('button', { name: 'Optimiser' });
    
    await expect(generateBtn).toBeEnabled();
    await expect(optimizeBtn).toBeEnabled();
    
    await context.close();
  });

  test('AI prompt generates layout based on description', async ({ page }) => {
    await page.goto('/');
    
    const prompt = "Je veux un lit transversal à l'arrière, une kitchenette compacte côté droit";
    await page.locator('.van-section.prompt textarea').fill(prompt);
    
    // Set options
    await page.locator('input[type="checkbox"]', { hasText: 'Cuisine' }).check();
    await page.locator('select', { hasText: 'Couchage' }).selectOption('2 pers');
    await page.locator('select', { hasText: 'Style' }).selectOption('Moderne');
    
    await page.getByRole('button', { name: 'Générer layout' }).click();
    
    // Wait for AI generation
    await expect(page.locator('text=Génération en cours')).toBeVisible();
    await expect(page.locator('text=Layout généré avec succès')).toBeVisible({ timeout: 30000 });
    
    // Verify objects were added to workspace
    const objects = page.locator('.workspace-object');
    await expect(objects).toHaveCount(await expect(objects).toHaveCount.gte(2));
  });

  test('prebuilt options affect AI generation', async ({ page }) => {
    await page.goto('/');
    
    // Enable all options
    await page.locator('input[type="checkbox"]', { hasText: 'Cuisine' }).check();
    await page.locator('input[type="checkbox"]', { hasText: 'Rangements' }).check();
    await page.locator('select', { hasText: 'Couchage' }).selectOption('4 pers');
    await page.locator('select', { hasText: 'Style' }).selectOption('Rustique');
    
    await page.getByRole('button', { name: 'Générer layout' }).click();
    await expect(page.locator('text=Layout généré')).toBeVisible({ timeout: 30000 });
    
    // Verify kitchen object exists
    await expect(page.locator('.workspace-object[data-type="kitchen"]')).toBeVisible();
    
    // Verify storage objects exist
    await expect(page.locator('.workspace-object[data-type="storage"]')).toHaveCount(await expect(page.locator('.workspace-object[data-type="storage"]')).toHaveCount.gte(1));
  });

  test('optimize improves existing layout', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('/login');
    await page.getByPlaceholder('Email').fill(testUsers.pro2.email);
    await page.getByPlaceholder('Mot de passe').fill(testUsers.pro2.password);
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await page.waitForURL('/');
    
    // First generate a layout
    await page.locator('.van-section.prompt textarea').fill('Layout basique');
    await page.getByRole('button', { name: 'Générer layout' }).click();
    await expect(page.locator('text=Layout généré')).toBeVisible({ timeout: 30000 });
    
    const objectsBefore = await page.locator('.workspace-object').count();
    
    // Now optimize
    await page.getByRole('button', { name: 'Optimiser' }).click();
    await expect(page.locator('text=Optimisation en cours')).toBeVisible();
    await expect(page.locator('text=Layout optimisé')).toBeVisible({ timeout: 30000 });
    
    // Objects may be repositioned or adjusted
    const objectsAfter = await page.locator('.workspace-object').count();
    expect(objectsAfter).toBeGreaterThanOrEqual(objectsBefore);
    
    await context.close();
  });

  test('AI generation respects van dimensions', async ({ page }) => {
    await page.goto('/');
    
    // Select small van
    await page.getByRole('button', { name: /Sélectionner un van/ }).click();
    await page.locator('[data-van-type="FIAT_DOBLO"]').click(); // 4406mm x 1832mm
    
    await page.locator('.van-section.prompt textarea').fill('Maximum de rangements');
    await page.getByRole('button', { name: 'Générer layout' }).click();
    await expect(page.locator('text=Layout généré')).toBeVisible({ timeout: 30000 });
    
    // Verify all objects fit within van boundaries
    const workspace = page.locator('.workspace-area');
    const workspaceBox = await workspace.boundingBox();
    
    const objects = page.locator('.workspace-object');
    const count = await objects.count();
    
    for (let i = 0; i < count; i++) {
      const objectBox = await objects.nth(i).boundingBox();
      expect(objectBox!.x).toBeGreaterThanOrEqual(workspaceBox!.x);
      expect(objectBox!.y).toBeGreaterThanOrEqual(workspaceBox!.y);
      expect(objectBox!.x + objectBox!.width).toBeLessThanOrEqual(workspaceBox!.x + workspaceBox!.width);
      expect(objectBox!.y + objectBox!.height).toBeLessThanOrEqual(workspaceBox!.y + workspaceBox!.height);
    }
  });
});
