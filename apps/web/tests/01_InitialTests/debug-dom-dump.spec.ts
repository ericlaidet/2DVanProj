// Test de diagnostic PROFOND - Dump du DOM
import { test, expect } from '@playwright/test';

const VALID_EMAIL = 'sonik.vigbea@gmail.com';
const VALID_PASSWORD = 'Sonik123';

test('DUMP DOM - Inspecter le contenu réel du Canvas', async ({ page }) => {
    console.log('🏁 Démarrage du diagnostic DOM...');

    // Login
    await page.goto('/login');
    await page.getByPlaceholder('Email').fill(VALID_EMAIL);
    await page.getByPlaceholder('Mot de passe').fill(VALID_PASSWORD);
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page).toHaveURL('/', { timeout: 10000 });

    // Sélectionner van
    await page.getByRole('button', { name: /Sélectionner un van/i }).click();
    const firstVan = page.locator('[data-van-type], .van-card').first();
    await firstVan.click();

    // Attendre chargement du canvas
    await page.waitForSelector('.van-canvas', { timeout: 5000 });
    await page.waitForTimeout(1000);

    // Ajouter un lit
    const bedCard = page.locator('.element-card', { hasText: 'Lit' }).first();
    await bedCard.click();

    // Attendre que le store soit à jour (via le compteur qu'on sait qui marche)
    const countBadge = page.getByTestId('furniture-count');
    await expect(countBadge).toHaveText('1', { timeout: 5000 });

    console.log('✅ Compteur passé à 1. Le store est OK.');
    await page.waitForTimeout(2000);

    // 🔍🔍🔍 DUMP DU HTML 🔍🔍🔍
    // On récupère tout le HTML à l'intérieur de la div du canvas
    const canvasContent = await page.evaluate(() => {
        const canvas = document.querySelector('.van-canvas');
        return canvas ? canvas.outerHTML : '❌ Canvas introuvable dans le DOM';
    });

    console.log('\n⬇️⬇️⬇️ HTML DU CANVAS ⬇️⬇️⬇️\n');
    console.log(canvasContent);
    console.log('\n⬆️⬆️⬆️ FIN DU DUMP ⬆️⬆️⬆️\n');

    // Analyse automatique
    if (canvasContent.includes('furniture-bed')) {
        console.log('✅ TRACE TROUVÉE : "furniture-bed" est présent dans le HTML.');
    } else {
        console.log('❌ TRACE MANQUANTE : "furniture-bed" n\'est PAS dans le HTML.');
    }

    if (canvasContent.includes('realistic-furniture-2d')) {
        console.log('✅ CLASSE TROUVÉE : "realistic-furniture-2d" est présent.');
    } else {
        console.log('❌ CLASSE MANQUANTE : Le composant enfant ne semble pas être rendu.');
    }
});
