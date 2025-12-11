// Test d'ajout de meubles - VERSION SIMPLIFIÉE POUR DÉBUG
import { test, expect } from '@playwright/test';

const VALID_EMAIL = 'sonik.vigbea@gmail.com';
const VALID_PASSWORD = 'Sonik123';

test('DÉBUG - Vérifier pourquoi le lit ne s\'ajoute pas', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.getByPlaceholder('Email').fill(VALID_EMAIL);
    await page.getByPlaceholder('Mot de passe').fill(VALID_PASSWORD);
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page).toHaveURL('/', { timeout: 10000 });

    console.log('✅ 1 - Connecté');

    // Sélectionner un van
    await page.getByRole('button', { name: /Sélectionner un van/i }).click();
    await page.waitForTimeout(500);

    const firstVan = page.locator('[data-van-type], .van-card').first();
    await firstVan.click();
    await page.waitForTimeout(2000); // ← PLUS LONG

    console.log('✅ 2 - Van sélectionné');

    // Vérifier que le van est affiché
    const vanInfo = await page.locator('text=/\\d{4}.*x.*\\d{3,4}/i').first().textContent();
    console.log(`📐 Van dimensions: ${vanInfo}`);

    // Vérifier que le bouton is VISIBLE
    const button = await page.locator('text=Volkswagen ID. Buzz').isVisible();
    console.log(`🚐 Bouton van visible: ${button}`);

    // MAINTENANT cliquer sur le lit
    console.log('🛏️ 3 - Clic sur le lit...');
    const bedCard = page.locator('.element-card').filter({ hasText: /Lit/i }).first();
    await expect(bedCard).toBeVisible();

    await bedCard.click();

    console.log('✅ 4 - Lit cliqué, attente...');
    await page.waitForTimeout(3000);

    // Vérifier le résultat
    const furnitureCount = await page.locator('[data-furniture-id]').count();
    console.log(`📊 Nombre de meubles: ${furnitureCount}`);

    if (furnitureCount === 0) {
        console.log('❌ PROBLÈME: Aucun meuble n\'a été ajouté');

        // Prendre screenshot pour débug
        await page.screenshot({ path: 'test-results/debug-no-furniture.png' });
    } else {
        console.log('✅ SUCCESS: Un meuble a été ajouté !');
    }
});
