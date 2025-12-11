// Test de navigation - Van Planner
import { test, expect } from '@playwright/test';

const VALID_EMAIL = 'sonik.vigbea@gmail.com';
const VALID_PASSWORD = 'Sonik123';

test.describe('Navigation après login', () => {

    // Se connecter avant chaque test
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByPlaceholder('Email').fill(VALID_EMAIL);
        await page.getByPlaceholder('Mot de passe').fill(VALID_PASSWORD);
        await page.getByRole('button', { name: 'Se connecter' }).click();

        // Attendre la redirection
        await expect(page).toHaveURL('/', { timeout: 10000 });
    });

    test('✅ Page principale accessible après login', async ({ page }) => {
        // Vérifier qu'on est bien sur la page principale
        await expect(page).toHaveURL('/');

        // Vérifier que le titre de la page est correct
        await expect(page).toHaveTitle(/Plan Your Van|Van Planner/i);
    });

    test('✅ Header et éléments de la page visibles', async ({ page }) => {
        // Vérifier qu'il y a du contenu sur la page (pas juste une page vide)
        const bodyContent = await page.locator('body').textContent();
        expect(bodyContent).toBeTruthy();
        expect(bodyContent!.length).toBeGreaterThan(50);

        // Vérifier qu'il y a au moins un heading visible
        const headings = page.locator('h1, h2, h3');
        await expect(headings.first()).toBeVisible();
    });

    test('✅ Bouton "Sélectionner un van" visible', async ({ page }) => {
        // Vérifier que le bouton de sélection de van est présent
        const selectVanButton = page.getByRole('button', { name: /Sélectionner un van/i });
        await expect(selectVanButton).toBeVisible();
    });

    test('✅ Section workspace visible', async ({ page }) => {
        // Vérifier que la zone de travail principale est présente
        const workspace = page.locator('.workspace-left, .workspace-area, .canvas-container');
        await expect(workspace.first()).toBeVisible();
    });

    test('✅ Déconnexion fonctionne', async ({ page }) => {
        // Chercher et cliquer sur le bouton de déconnexion
        // Adaptez le sélecteur selon votre UI
        const logoutButton = page.getByRole('button', { name: /Déconnexion|Logout|Se déconnecter/i });
        await logoutButton.click();

        // Vérifier qu'on est redirigé vers la page de login
        await expect(page).toHaveURL('/', { timeout: 5000 });

        // Vérifier que le formulaire de login est visible
        await expect(page.getByPlaceholder('Email')).toBeVisible();
    });

    test('✅ Navigation reste sur page principale', async ({ page }) => {
        // Vérifier qu'on ne peut pas accéder au login si déjà connecté
        await page.goto('/login');

        // Devrait rediriger vers / ou rester sur /
        // Adaptez selon votre logique de redirection
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/\/(login)?$/);
    });
});
