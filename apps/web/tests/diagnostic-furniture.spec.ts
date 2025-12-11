// Test de diagnostic - Vérifier pourquoi le lit n'apparaît pas
import { test, expect } from '@playwright/test';

const VALID_EMAIL = 'sonik.vigbea@gmail.com';
const VALID_PASSWORD = 'Sonik123';

test('🔍 DIAGNOSTIC - Ajouter un lit et voir ce qui se passe', async ({ page }) => {
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

    console.log('✅ 1 -  Van sélectionné');

    // Prendre screenshot AVANT
    await page.screenshot({ path: 'test-results/avant-ajout-lit.png' });

    // Chercher le lit dans la palette
    const bedElement = page.locator('.element-card').filter({ hasText: /Lit|🛏️/i });
    const count = await bedElement.count();
    console.log(`🔍 2 - Nombre d'éléments "Lit" trouvés: ${count}`);

    if (count > 0) {
        console.log('✅ 3 - Élément lit trouvé, on clique dessus');
        await bedElement.first().click();

        // Attendre
        await page.waitForTimeout(2000);

        // Prendre screenshot APRÈS
        await page.screenshot({ path: 'test-results/apres-ajout-lit.png' });

        // Vérifier le DOM complet
        const allDivs = await page.locator('div').allTextContents();
        console.log('📋 4 - Tous les divs:', allDivs.slice(0, 20));

        // Chercher tous les éléments avec data-testid
        const elementsWithTestId = await page.locator('[data-testid]').count();
        console.log(`🔍 5 - Éléments avec data-testid: ${elementsWithTestId}`);

        // Chercher spécifiquement furniture-bed
        const bedOnCanvas = page.locator('[data-testid="furniture-bed"]');
        const bedCount = await bedOnCanvas.count();
        console.log(`🔍 6 - Éléments [data-testid="furniture-bed"]: ${bedCount}`);

        // Chercher par data-type
        const bedByType = page.locator('[data-type="bed"]');
        const bedTypeCount = await bedByType.count();
        console.log(`🔍 7 - Éléments [data-type="bed"]: ${bedTypeCount}`);

        // Chercher par classe
        const bedByClass = page.locator('.realistic-furniture-2d');
        const bedClassCount = await bedByClass.count();
        console.log(`🔍 8   - Éléments .realistic-furniture-2d: ${bedClassCount}`);

        // Si trouvé par classe, regarder ses attributs
        if (bedClassCount > 0) {
            const firstFurniture = bedByClass.first();
            const testId = await firstFurniture.getAttribute('data-testid');
            const furnitureId = await firstFurniture.getAttribute('data-furniture-id');
            const type = await firstFurniture.getAttribute('data-type');
            console.log(`📦 Premier meuble - testid: ${testId}, id: ${furnitureId}, type: ${type}`);
        }
    } else {
        console.log('❌ 11 - Aucun élément "Lit" trouvé dans la palette');
    }
});
