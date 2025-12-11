// Test de login - Van Planner
import { test, expect } from '@playwright/test';

// ⚠️ REMPLACEZ CES VALEURS PAR VOS VRAIS IDENTIFIANTS
const VALID_EMAIL = 'sonik.vigbea@gmail.com';
const VALID_PASSWORD = 'Sonik123';

test.describe('Login - Tests simples', () => {

    test('✅ Login avec identifiants corrects', async ({ page }) => {
        // Aller sur la page de login
        await page.goto('/login');

        // Remplir le formulaire
        await page.getByPlaceholder('Email').fill(VALID_EMAIL);
        await page.getByPlaceholder('Mot de passe').fill(VALID_PASSWORD);

        // Cliquer sur Se connecter
        await page.getByRole('button', { name: 'Se connecter' }).click();

        // Vérifier qu'on est bien connecté
        // Adaptez selon ce qui s'affiche après connexion réussie
        await expect(page.locator('text=Connexion réussie')).toBeVisible({ timeout: 10000 });

        // Vérifier qu'on est redirigé vers la page principale
        await expect(page).toHaveURL('/');
    });

    test('❌ Login avec mot de passe incorrect', async ({ page }) => {
        // Aller sur la page de login
        await page.goto('/login');

        // Remplir avec un mauvais mot de passe
        await page.getByPlaceholder('Email').fill(VALID_EMAIL);
        await page.getByPlaceholder('Mot de passe').fill('MAUVAIS_MOT_DE_PASSE');

        // Cliquer sur Se connecter
        await page.getByRole('button', { name: 'Se connecter' }).click();

        // Vérifier qu'un message d'erreur s'affiche
        await expect(page.locator('text=Identifiants incorrects')).toBeVisible({ timeout: 5000 });

        // Vérifier qu'on reste sur la page de login
        await expect(page).toHaveURL('/login');
    });

});
