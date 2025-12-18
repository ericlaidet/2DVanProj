// Test de sélection de van - Van Planner
import { test, expect } from '@playwright/test';

const VALID_EMAIL = 'sonik.vigbea@gmail.com';
const VALID_PASSWORD = 'Sonik123';

test.describe('Sélection de van', () => {

    // Se connecter avant chaque test
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByPlaceholder('Email').fill(VALID_EMAIL);
        await page.getByPlaceholder('Mot de passe').fill(VALID_PASSWORD);
        await page.getByRole('button', { name: 'Se connecter' }).click();

        // Attendre la redirection
        await expect(page).toHaveURL('/', { timeout: 10000 });
    });

    test('✅ Modal de sélection de van s\'ouvre', async ({ page }) => {
        // Cliquer sur le bouton "Sélectionner un van"
        const selectVanButton = page.getByRole('button', { name: /Sélectionner un van/i });
        await selectVanButton.click();

        // Vérifier que le modal s'ouvre en cherchant le titre H2 spécifiquement
        await expect(page.getByRole('heading', { name: /Choisir un van/i })).toBeVisible({ timeout: 5000 });

        // Vérifier que des options de vans sont affichées
        const vanCards = page.locator('[data-testid="van-card"], .van-card, [data-van-type]');
        await expect(vanCards.first()).toBeVisible({ timeout: 5000 });
    });

    test('✅ Peut sélectionner un Mercedes Sprinter', async ({ page }) => {
        // Ouvrir le modal
        await page.getByRole('button', { name: /Sélectionner un van/i }).click();

        // Attendre que le modal soit visible
        await page.waitForTimeout(500);

        // Sélectionner Mercedes Sprinter (chercher par texte ou data-attribute)
        const sprinter = page.locator('text=Mercedes').or(page.locator('[data-van-type*="SPRINTER"]')).first();
        await sprinter.click();

        // Vérifier que le modal se ferme
        await expect(page.locator('text=Choisir un van')).not.toBeVisible({ timeout: 5000 });
    });

    test('✅ Canvas s\'affiche après sélection de van', async ({ page }) => {
        // Sélectionner un van
        await page.getByRole('button', { name: /Sélectionner un van/i }).click();
        await page.waitForTimeout(500);

        const firstVan = page.locator('[data-testid="van-card"], .van-card, [data-van-type]').first();
        await firstVan.click();

        // Vérifier que le canvas/workspace s'affiche
        const canvas = page.locator('.van-canvas, .canvas-container, canvas');
        await expect(canvas.first()).toBeVisible({ timeout: 5000 });
    });

    test('✅ Dimensions du van s\'affichent', async ({ page }) => {
        // Sélectionner un van
        await page.getByRole('button', { name: /Sélectionner un van/i }).click();
        await page.waitForTimeout(500);

        const firstVan = page.locator('[data-testid="van-card"], .van-card, [data-van-type]').first();
        await firstVan.click();

        // Vérifier que les dimensions du van sont affichées quelque part
        // Chercher des nombres qui ressemblent à des dimensions (ex: 5900 x 1993)
        const dimensionText = page.locator('text=/\\d{4}.*x.*\\d{3,4}/i');
        await expect(dimensionText.first()).toBeVisible({ timeout: 5000 });
    });

    test('✅ Toggle 2D/3D visible après sélection', async ({ page }) => {
        // Sélectionner un van
        await page.getByRole('button', { name: /Sélectionner un van/i }).click();
        await page.waitForTimeout(500);

        const firstVan = page.locator('[data-testid="van-card"], .van-card, [data-van-type]').first();
        await firstVan.click();

        // Vérifier que les boutons 2D/3D sont visibles
        const toggle2D = page.getByRole('button', { name: '2D' });
        const toggle3D = page.getByRole('button', { name: '3D' });

        await expect(toggle2D.or(toggle3D)).toBeVisible({ timeout: 5000 });
    });

    test('✅ Peut changer de van', async ({ page }) => {
        // Sélectionner un premier van
        await page.getByRole('button', { name: /Sélectionner un van/i }).click();
        await page.waitForTimeout(500);
        const firstVan = page.locator('[data-testid="van-card"], .van-card, [data-van-type]').first();
        await firstVan.click();

        // Attendre un peu
        await page.waitForTimeout(1000);

        // Ouvrir à nouveau le modal
        await page.getByRole('button', { name: /Volkswagen ID. Buzz/i }).click();
        //        await page.getByRole('button', { name: /Sélectionner un van/i }).click();
        await page.waitForTimeout(500);

        // Sélectionner un autre van (le deuxième dans la liste)
        const secondVan = page.locator('[data-testid="van-card"], .van-card, [data-van-type]').nth(1);
        await secondVan.click();

        // Vérifier que le canvas est toujours visible
        const canvas = page.locator('.van-canvas, .canvas-container, canvas');
        await expect(canvas.first()).toBeVisible({ timeout: 5000 });
    });
});
