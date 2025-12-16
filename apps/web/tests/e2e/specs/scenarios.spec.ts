import { test, expect } from '@playwright/test';
import { VanPlannerPage } from '../pages/VanPlannerPage';
import { AuthPage } from '../pages/AuthPage';
import { accountScenarios, furnitureScenarios } from '../fixtures/test-data';

// 1. Data-Driven Tests for Furniture Sizing
test.describe('Adaptive Furniture Sizing', () => {
    let vanPage: VanPlannerPage;
    let authPage: AuthPage;

    test.beforeEach(async ({ page }) => {
        vanPage = new VanPlannerPage(page);
        authPage = new AuthPage(page);
        await authPage.mockLoginSuccess();
        await vanPage.goto();
        await authPage.login();
    });

    for (const scenario of furnitureScenarios) {
        test(`should adapt bed size for ${scenario.type}`, async ({ page }) => {
            await vanPage.selectVan(scenario.type);
            await vanPage.addFurniture('Lit');
            await expect(page.getByTestId('furniture-bed').first()).toBeVisible();
        });
    }
});
