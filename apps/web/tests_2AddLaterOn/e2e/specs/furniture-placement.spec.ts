import { test, expect } from '@playwright/test';
import { VanPlannerPage } from '../pages/VanPlannerPage';
import { AuthPage } from '../pages/AuthPage';

test.describe('Furniture Placement', () => {
    let vanPage: VanPlannerPage;
    let authPage: AuthPage;

    test.beforeEach(async ({ page }) => {
        vanPage = new VanPlannerPage(page);
        authPage = new AuthPage(page);

        // 1. Go to App (redirects to Login)
        await vanPage.goto();

        // 2. Perform Real Login (as debug test does)
        // Using credentials from debug-add-furniture.spec.ts
        await authPage.login('sonik.vigbea@gmail.com', 'Sonik123');
    });

    test('should place furniture correctly in ID. Buzz', async ({ page }) => {
        // Now we are logged in, we can select a van
        await vanPage.selectVan('Volkswagen ID. Buzz');

        // Add Furniture
        await vanPage.addFurniture('Lit');
        await vanPage.addFurniture('Cuisine');

        // Verify
        const count = await vanPage.getFurnitureCount();
        expect(count).toBe(2);

        await expect(page.getByTestId('furniture-bed')).toBeVisible();
    });
});
