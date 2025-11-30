// ----------------------------------------------------------------------------
// 6. VAN SELECTION TESTS (tests/editor/van-selection.spec.ts)
// ----------------------------------------------------------------------------
import { test, expect } from '../fixtures';

test.describe('Van Selection & Workspace', () => {
  
  test('opens van selector modal', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Sélectionner un van/ }).click();
    
    await expect(page.locator('text=Choisir un van')).toBeVisible();
  });

  test('displays all van types with images', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Sélectionner un van/ }).click();
    
    // Check at least 10 vans are displayed
    const vanCards = page.locator('[data-testid="van-card"]');
    await expect(vanCards).toHaveCount(21); // Total vans from schema
    
    // Verify first van has required info
    const firstVan = vanCards.first();
    await expect(firstVan.locator('.display-name')).toBeVisible();
    await expect(firstVan.locator('.category')).toBeVisible();
    await expect(firstVan.locator('img')).toBeVisible();
  });

  test('filters vans by category', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Sélectionner un van/ }).click();
    
    // Select "Petit Van" category
    await page.getByRole('button', { name: 'Petit Van' }).click();
    
    const vanCards = page.locator('[data-testid="van-card"]');
    await expect(vanCards).toHaveCount(3); // VOLKSWAGEN_ID_BUZZ, RENAULT_KANGOO_EXPRESS, FIAT_DOBLO
  });

  test('selecting van updates workspace dimensions', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Sélectionner un van/ }).click();
    
    // Select VOLKSWAGEN_ID_BUZZ (4712mm x 1985mm)
    await page.locator('[data-van-type="VOLKSWAGEN_ID_BUZZ"]').click();
    
    // Verify workspace shows correct dimensions
    const workspace = page.locator('.workspace-area');
    const dimensions = await workspace.getAttribute('data-dimensions');
    expect(dimensions).toContain('4712');
    expect(dimensions).toContain('1985');
  });

  test('workspace loads SVG overlay for selected van', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Sélectionner un van/ }).click();
    await page.locator('[data-van-type="MERCEDES_SPRINTER_L3H2"]').click();
    
    // Verify SVG is loaded
    const svg = page.locator('svg.van-overlay');
    await expect(svg).toBeVisible();
    await expect(svg).toHaveAttribute('data-van', 'MERCEDES_SPRINTER_L3H2');
  });

  test('workspace is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
    await page.goto('/');
    
    const workspace = page.locator('.workspace-area');
    await expect(workspace).toBeVisible();
    
    // Verify workspace scales to fit
    const box = await workspace.boundingBox();
    expect(box!.width).toBeLessThanOrEqual(375);
  });
});
