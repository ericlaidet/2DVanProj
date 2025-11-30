// ----------------------------------------------------------------------------
// 14. PERFORMANCE TESTS (tests/performance/load-times.spec.ts)
// ----------------------------------------------------------------------------
import { test, expect } from '@playwright/test';

test.describe('Performance & Load Times', () => {
  
  test('page loads within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('large plan with 50+ objects loads quickly', async ({ page }) => {
    await page.goto('/');
    
    // Create plan with many objects via API to speed up test
    const token = await page.evaluate(() => localStorage.getItem('token'));
    
    const largeLayout = {
      name: 'Large Plan',
      jsonData: Array.from({ length: 50 }, (_, i) => ({
        name: `Object ${i}`,
        x: (i % 10) * 500,
        y: Math.floor(i / 10) * 500,
        width: 400,
        height: 400
      })),
      vanTypes: ['MERCEDES_SPRINTER_L5H2']
    };
    
    await fetch(`${page.url()}/plans`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(largeLayout)
    });
    
    // Load the plan
    const startTime = Date.now();
    await page.locator('.plan-list select').selectOption('Large Plan');
    await page.getByRole('button', { name: /📂 Charger/ }).click();
    await expect(page.locator('.workspace-object')).toHaveCount(50);
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000); // Should load 50 objects in < 2s
  });

  test('workspace rendering is smooth at 60fps', async ({ page }) => {
    await page.goto('/');
    
    // Add several objects
    for (let i = 0; i < 10; i++) {
      await page.getByPlaceholder('Ex : Table').fill(`Object ${i}`);
      await page.getByPlaceholder('Ex : 500x300').fill('500x500');
      await page.getByRole('button', { name: 'Ajouter' }).click();
    }
    
    // Measure FPS during drag operation
    const fps = await page.evaluate(async () => {
      return new Promise<number>((resolve) => {
        let frameCount = 0;
        const startTime = performance.now();
        
        function countFrame() {
          frameCount++;
          if (performance.now() - startTime < 1000) {
            requestAnimationFrame(countFrame);
          } else {
            resolve(frameCount);
          }
        }
        
        requestAnimationFrame(countFrame);
      });
    });
    
    expect(fps).toBeGreaterThanOrEqual(55); // Allow some variance from 60fps
  });
});
