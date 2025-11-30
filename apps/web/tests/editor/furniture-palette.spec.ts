// ----------------------------------------------------------------------------
// 7. OBJECT CATALOG TESTS (tests/editor/furniture-palette.spec.ts)
// ----------------------------------------------------------------------------
import { test, expect } from '../fixtures';

test.describe('Object Catalog & Furniture Palette', () => {
  
  test('adds object with name, dimensions and color', async ({ page }) => {
    await page.goto('/');
    
    // Fill object details
    await page.getByPlaceholder('Ex : Table').fill('Table Cuisine');
    await page.getByPlaceholder('Ex : 500x300').fill('800x600');
    
    // Select color (red)
    await page.locator('.color-picker [data-color="red"]').click();
    
    // Add object
    await page.getByRole('button', { name: 'Ajouter' }).click();
    
    // Verify object appears on workspace
    const object = page.locator('.workspace-object[data-name="Table Cuisine"]');
    await expect(object).toBeVisible();
    await expect(object).toHaveCSS('background-color', 'rgb(255, 0, 0)');
  });

  test('object shows name in center', async ({ page }) => {
    await page.goto('/');
    
    await page.getByPlaceholder('Ex : Table').fill('Lit');
    await page.getByPlaceholder('Ex : 500x300').fill('2000x1400');
    await page.getByRole('button', { name: 'Ajouter' }).click();
    
    const objectLabel = page.locator('.workspace-object[data-name="Lit"] .object-label');
    await expect(objectLabel).toHaveText('Lit');
    
    // Verify centered
    const hasCenter = await objectLabel.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return computed.position === 'absolute' && 
             computed.left === '50%' && 
             computed.top === '50%';
    });
    expect(hasCenter).toBeTruthy();
  });

  test('drag and drop object on workspace', async ({ page }) => {
    await page.goto('/');
    
    // Add object
    await page.getByPlaceholder('Ex : Table').fill('Armoire');
    await page.getByPlaceholder('Ex : 500x300').fill('600x400');
    await page.getByRole('button', { name: 'Ajouter' }).click();
    
    const object = page.locator('.workspace-object[data-name="Armoire"]');
    const initialBox = await object.boundingBox();
    
    // Drag object
    await object.dragTo(page.locator('.workspace-area'), {
      targetPosition: { x: 200, y: 150 }
    });
    
    const finalBox = await object.boundingBox();
    expect(finalBox!.x).not.toBe(initialBox!.x);
    expect(finalBox!.y).not.toBe(initialBox!.y);
  });

  test('objects cannot overlap (collision detection)', async ({ page }) => {
    await page.goto('/');
    
    // Add first object
    await page.getByPlaceholder('Ex : Table').fill('Object1');
    await page.getByPlaceholder('Ex : 500x300').fill('1000x500');
    await page.getByRole('button', { name: 'Ajouter' }).click();
    
    const obj1 = page.locator('.workspace-object[data-name="Object1"]');
    await obj1.dragTo(page.locator('.workspace-area'), {
      targetPosition: { x: 100, y: 100 }
    });
    
    // Add second object
    await page.getByPlaceholder('Ex : Table').fill('Object2');
    await page.getByPlaceholder('Ex : 500x300').fill('1000x500');
    await page.locator('.color-picker [data-color="blue"]').click();
    await page.getByRole('button', { name: 'Ajouter' }).click();
    
    const obj2 = page.locator('.workspace-object[data-name="Object2"]');
    
    // Try to drag obj2 over obj1
    await obj2.dragTo(page.locator('.workspace-area'), {
      targetPosition: { x: 100, y: 100 }
    });
    
    // Verify objects don't overlap
    const box1 = await obj1.boundingBox();
    const box2 = await obj2.boundingBox();
    
    const overlap = !(
      box1!.x + box1!.width < box2!.x ||
      box2!.x + box2!.width < box1!.x ||
      box1!.y + box1!.height < box2!.y ||
      box2!.y + box2!.height < box1!.y
    );
    
    expect(overlap).toBeFalsy();
  });

  test('object dimensions use meters matching workspace', async ({ page }) => {
    await page.goto('/');
    
    // Workspace is in meters (e.g., 4.712m x 1.985m)
    // Add object with 1x1 meter dimensions
    await page.getByPlaceholder('Ex : Table').fill('TestObject');
    await page.getByPlaceholder('Ex : 500x300').fill('1000x1000'); // 1m x 1m in mm
    await page.getByRole('button', { name: 'Ajouter' }).click();
    
    const object = page.locator('.workspace-object[data-name="TestObject"]');
    const dimensions = await object.getAttribute('data-dimensions');
    expect(dimensions).toBe('1x1'); // Stored in meters
  });
});
