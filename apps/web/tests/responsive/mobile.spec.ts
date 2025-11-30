// ----------------------------------------------------------------------------
// 12. RESPONSIVE DESIGN TESTS (tests/responsive/mobile.spec.ts)
// ----------------------------------------------------------------------------
import { test, expect, devices } from '@playwright/test';

test.describe('Responsive Design', () => {
  
  test('mobile layout displays correctly', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 13']
    });
    const page = await context.newPage();
    
    await page.goto('/');
    
    // Verify mobile layout
    const header = page.locator('.van-editor-header');
    await expect(header).toBeVisible();
    
    // Navigation should be hamburger menu on mobile
    const hamburger = page.locator('.hamburger-menu');
    await expect(hamburger).toBeVisible();
    
    await context.close();
  });

  test('tablet layout adapts workspace', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPad Pro']
    });
    const page = await context.newPage();
    
    await page.goto('/');
    
    const workspace = page.locator('.workspace-area');
    const box = await workspace.boundingBox();
    
    // Workspace should fit tablet width
    expect(box!.width).toBeLessThanOrEqual(1024);
    
    await context.close();
  });

  test('desktop has full layout', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    // All navigation buttons visible inline
    const nav = page.locator('.van-editor-nav');
    const buttons = nav.locator('button');
    await expect(buttons).toHaveCount(4);
    
    // Two-column layout
    const objectCatalog = page.locator('.object_catalog');
    const vanWorkspace = page.locator('.van_workspace');
    await expect(objectCatalog).toBeVisible();
    await expect(vanWorkspace).toBeVisible();
  });
});
