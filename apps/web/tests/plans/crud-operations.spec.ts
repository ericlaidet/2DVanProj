// ----------------------------------------------------------------------------
// 8. PLAN MANAGEMENT TESTS (tests/plans/crud-operations.spec.ts)
// ----------------------------------------------------------------------------
import { test, expect } from '../fixtures';

test.describe('Plan CRUD Operations', () => {
  
  test('saves new plan to database', async ({ page, request }) => {
    await page.goto('/');
    
    const planName = `Test Plan ${Date.now()}`;
    
    // Create and save plan
    await page.getByRole('button', { name: 'Sauvegarder' }).click();
    await page.getByPlaceholder(/nom/i).fill(planName);
    await page.getByRole('button', { name: 'Confirmer' }).click();
    
    // Verify success notification
    await expect(page.locator(`text=Plan "${planName}" sauvegardé`)).toBeVisible();
    
    // Verify plan appears in list
    await expect(page.locator(`.plan-list [data-plan-name="${planName}"]`)).toBeVisible();
    
    // Verify in database via API
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const response = await request.get('/plans', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const plans = await response.json();
    const savedPlan = plans.find((p: any) => p.name === planName);
    expect(savedPlan).toBeDefined();
  });

  test('loads existing plan from database', async ({ page }) => {
    await page.goto('/');
    
    // Assume plan exists from previous test
    const planList = page.locator('.plan-list select');
    await planList.selectOption({ index: 1 }); // Select first plan
    
    await page.getByRole('button', { name: /📂 Charger/ }).click();
    
    // Verify plan loads
    await expect(page.locator('text=Plan chargé')).toBeVisible();
    
    // Verify workspace updates
    const workspace = page.locator('.workspace-area');
    await expect(workspace).toHaveAttribute('data-plan-loaded', 'true');
  });

  test('updates existing plan', async ({ page }) => {
    await page.goto('/');
    
    // Load a plan
    const planList = page.locator('.plan-list select');
    await planList.selectOption({ index: 1 });
    await page.getByRole('button', { name: /📂 Charger/ }).click();
    
    // Make changes (add object)
    await page.getByPlaceholder('Ex : Table').fill('New Object');
    await page.getByPlaceholder('Ex : 500x300').fill('500x300');
    await page.getByRole('button', { name: 'Ajouter' }).click();
    
    // Update plan
    await page.getByRole('button', { name: /✏️ Mettre à jour/ }).click();
    
    await expect(page.locator('text=Plan mis à jour')).toBeVisible();
  });

  test('renames plan', async ({ page }) => {
    await page.goto('/');
    
    // Select plan
    const planList = page.locator('.plan-list select');
    await planList.selectOption({ index: 1 });
    
    // Rename
    await page.getByRole('button', { name: /✏️ Renommer/ }).click();
    
    const newName = `Renamed Plan ${Date.now()}`;
    await page.getByPlaceholder(/nouveau nom/i).fill(newName);
    await page.getByRole('button', { name: 'Confirmer' }).click();
    
    // Verify renamed
    await expect(page.locator(`text=${newName}`)).toBeVisible();
  });

  test('deletes plan from database', async ({ page, request }) => {
    await page.goto('/');
    
    // Select plan
    const planList = page.locator('.plan-list select');
    const planName = await planList.locator('option').nth(1).textContent();
    await planList.selectOption({ index: 1 });
    
    // Delete
    await page.getByRole('button', { name: /🗑️ Supprimer/ }).click();
    await page.getByRole('button', { name: 'Confirmer' }).click();
    
    // Verify deleted
    await expect(page.locator(`text=${planName}`)).not.toBeVisible();
    
    // Verify workspace cleared
    const workspace = page.locator('.workspace-area');
    await expect(workspace).toHaveAttribute('data-plan-loaded', 'false');
  });

  test('displays plan count correctly', async ({ page }) => {
    await page.goto('/');
    
    const planCountHeader = page.locator('text=/Liste de plans sauvegardés \\((\\d+)\\)/');
    await expect(planCountHeader).toBeVisible();
    
    const count = await planCountHeader.textContent();
    const numberMatch = count!.match(/\((\d+)\)/);
    const planCount = parseInt(numberMatch![1]);
    
    // Verify count matches actual plans in list
    const planOptions = page.locator('.plan-list select option');
    const actualCount = await planOptions.count() - 1; // Minus default option
    expect(planCount).toBe(actualCount);
  });
});
