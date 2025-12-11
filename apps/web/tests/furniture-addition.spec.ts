// Test d'ajout de meubles - Van Planner (VERSION ROBUSTE avec data-testid)
import { test, expect } from '@playwright/test';

const VALID_EMAIL = 'sonik.vigbea@gmail.com';
const VALID_PASSWORD = 'Sonik123';

test.describe('Ajout de meubles sur le canvas', () => {

    // Se connecter et sélectionner un van avant chaque test
    test.beforeEach(async ({ page }) => {
        // Login
        await page.goto('/login');
        await page.getByPlaceholder('Email').fill(VALID_EMAIL);
        await page.getByPlaceholder('Mot de passe').fill(VALID_PASSWORD);
        await page.getByRole('button', { name: 'Se connecter' }).click();
        await expect(page).toHaveURL('/', { timeout: 10000 });

        // Sélectionner un van
        await page.getByRole('button', { name: /Sélectionner un van/i }).click();
        await page.waitForTimeout(500);
        const firstVan = page.locator('[data-van-type], .van-card').first();
        await firstVan.click();
        await page.waitForTimeout(1000);
    });

    test('✅ Palette de meubles visible', async ({ page }) => {
        // Vérifier que la palette d'objets est visible
        const palette = page.locator('.predefined-elements-grid, .element-card');
        await expect(palette.first()).toBeVisible({ timeout: 5000 });
    });


test('✅ TEST2 Peut ajouter un lit depuis la palette', async ({ page }) => {
  // ✅ Trouver la carte lit dans la palette
  const bedCard = page.locator('.element-card', { hasText: 'Lit' }).first();
  
  // ✅ S'assurer qu'elle est visible avant de cliquer
  await expect(bedCard).toBeVisible();
  
  // ✅ Cliquer
  await bedCard.click();
  
  // ✅ Attendre que le compteur change de 0 à 1 (preuve que le meuble a été ajouté)
  await expect(page.locator('text=0').first()).not.toBeVisible({ timeout: 5000 });
  
  // OU attendre directement le meuble avec un timeout généreux
  const bedOnCanvas = page.locator('[data-testid="furniture-bed"]');
  await expect(bedOnCanvas).toBeVisible({ timeout: 15000 });
});

/*test('✅ TEST3 - Peut ajouter un lit depuis la palette', async ({ page }) => {
  // Compter les meubles AVANT
  const countBefore = await page.locator('[data-furniture-id]').count();
  
  // Cliquer sur le lit
  await page.locator('.element-card', { hasText: 'Lit' }).first().click();
  
  // Attendre que le nombre de meubles augmente
  await expect(page.locator('[data-furniture-id]')).toHaveCount(countBefore + 1, { timeout: 10000 });
  
  // Puis vérifier le type
  await expect(page.locator('[data-testid="furniture-bed"]')).toBeVisible();
});
*/

/*
    test('✅ Peut ajouter un lit depuis la palette', async ({ page }) => {
        // Cliquer sur l'élément "Lit"
        const bedElement = page.locator('.element-card').filter({ hasText: /Lit|🛏️/i }).first();
        await bedElement.click();

        // ✅ Attendre plus longtemps pour que le meuble s'affiche
        await page.waitForTimeout(2000);

        // ✅ Vérifier qu'un meuble avec data-testid="furniture-bed" apparaît
        const bedOnCanvas = page.locator('[data-testid="furniture-bed"]');
        await expect(bedOnCanvas).toBeVisible({ timeout: 10000 });

        // Vérifier aussi avec data-type
        const bedByType = page.locator('[data-type="bed"]');
        await expect(bedByType).toBeVisible({ timeout: 5000 });
    });

    test('✅ Peut ajouter une cuisine depuis la palette', async ({ page }) => {
        // Cliquer sur l'élément "Cuisine"
        const kitchenElement = page.locator('.element-card').filter({ hasText: /Cuisine|🍳/i }).first();
        await kitchenElement.click();
        await page.waitForTimeout(2000);

        // ✅ Vérifier qu'une cuisine apparaît
        const kitchenOnCanvas = page.locator('[data-testid="furniture-kitchen"]');
        await expect(kitchenOnCanvas).toBeVisible({ timeout: 10000 });
    });

*/

    test('✅ Peut ajouter plusieurs meubles', async ({ page }) => {
        // Ajouter un lit
        await page.locator('.element-card').filter({ hasText: /Lit/i }).first().click();
        await page.waitForTimeout(1500);

        // Ajouter une cuisine
        await page.locator('.element-card').filter({ hasText: /Cuisine/i }).first().click();
        await page.waitForTimeout(1500);

        // Ajouter un rangement
        await page.locator('.element-card').filter({ hasText: /Rangement/i }).first().click();
        await page.waitForTimeout(1500);

        // ✅ Vérifier qu'il y a exactement 3 meubles sur le canvas
        const allFurniture = page.locator('[data-furniture-id]');
        await expect(allFurniture).toHaveCount(3, { timeout: 10000 });
    });

    test('✅ Toggle 2D/3D avec meubles', async ({ page }) => {
        // Ajouter un meuble en 2D
        await page.locator('.element-card').filter({ hasText: /Table/i }).first().click();
        await page.waitForTimeout(1000);

        // Vérifier qu'il est sur le canvas
        await expect(page.locator('[data-testid="furniture-table"]')).toBeVisible();

        // Basculer en 3D
        await page.getByRole('button', { name: '3D' }).click();
        await page.waitForTimeout(1500);

        // Vérifier que le canvas 3D est visible
        const canvas3D = page.locator('.van-canvas-3d, canvas');
        await expect(canvas3D.first()).toBeVisible();

        // Retour en 2D
        await page.getByRole('button', { name: '2D' }).click();
        await page.waitForTimeout(500);

        // Vérifier que le meuble est toujours là
        await expect(page.locator('[data-testid="furniture-table"]')).toBeVisible();
    });

    test('✅ Meubles persistent après toggle 2D/3D', async ({ page }) => {
        // Ajouter 2 meubles
        await page.locator('.element-card').filter({ hasText: /Lit/i }).first().click();
        await page.waitForTimeout(500);
        await page.locator('.element-card').filter({ hasText: /Cuisine/i }).first().click();
        await page.waitForTimeout(500);

        // Compter les meubles en 2D
		//const furniture = page.locator('[data-furniture-id]');
		//await expect(furniture).toHaveCount(2);
		const count_1 = page.locator('.objects-count-badge');
		await expect(count_1).toHaveText('2');

        // Basculer en 3D
        await page.getByRole('button', { name: '3D' }).click();
        await page.waitForTimeout(1500);

        // Basculer en 2D
        await page.getByRole('button', { name: '2D' }).click();
        await page.waitForTimeout(500);

        // ✅ Vérifier que les 2 meubles sont toujours là
        //const furnitureFinal = page.locator('[data-furniture-id]');
        //await expect(furnitureFinal).toHaveCount(2);
		const count_2 = page.locator('.objects-count-badge');
		await expect(count_2).toHaveText('2');

//        // Vérifier que les types sont bien là
//        await expect(page.locator('[data-type="bed"]')).toBeVisible();
//        await expect(page.locator('[data-type="kitchen"]')).toBeVisible();
    });

    test('✅ Formulaire d\'ajout personnalisé visible', async ({ page }) => {
        // Vérifier que le formulaire d'ajout personnalisé est présent
        const customForm = page.locator('.custom-element-form, .custom-element-section');
        await expect(customForm.first()).toBeVisible({ timeout: 5000 });
    });
});
