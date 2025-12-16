import { test, expect } from '@playwright/test';
import { VanPlannerPage } from '../pages/VanPlannerPage';
import { AuthPage } from '../pages/AuthPage';

test.describe('API Resilience & Security', () => {

    // For 401 test, we WANT to fail auth, so we don't necessarily need to login first if the goal is to test the reaction to a failed profile fetch.
    // However, if the app redirects to login on 401, we should check that.

    test('should handle Unauthorized (401) and redirect to login', async ({ page }) => {
        // 1. Mock API to return 401 for profile check (simulating session expiry or invalid token)
        await page.route('**/auth/profile', async route => {
            await route.fulfill({
                status: 401,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'Unauthorized' }),
            });
        });

        // 2. Inject a fake token so useAuth attempts to validate it
        // If we don't do this, useAuth returns early because no token is present, and we don't test the API error flow
        await page.addInitScript(() => {
            localStorage.setItem('token', 'fake-expired-token');
        });

        const vanPage = new VanPlannerPage(page);

        // 3. Go to App Root
        await vanPage.goto();

        // 4. Verify redirection to Login or Login state
        // If app checks auth on load and fails, it renders Login or redirects to /login
        await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible();
    });

    test('should handle Malformed Data gracefully', async ({ page }) => {
        // We need to be logged in to reach the dashboard where settings/data are loaded
        const authPage = new AuthPage(page);
        const vanPage = new VanPlannerPage(page);

        // 1. Setup Base Mocks (Login, Profile, default Settings)
        await authPage.mockLoginSuccess();

        // 2. Override Settings Mock with Malformed Data
        // Must be done BEFORE login triggers the fetch
        await page.route('**/users/settings', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: '{"invalid_json": [}',                // Malformed JSON
            });
        });

        // 3. Go to Login Page
        await vanPage.goto();

        // 4. Perform UI Login
        // This triggers checkAuth -> profile (OK) -> settings (Malformed)
        await authPage.login();

        // 5. Verify app didn't crash (white screen)
        // Check if canvas container is visible (means we are logged in and UI rendered)
        await expect(vanPage.canvasContainer).toBeVisible({ timeout: 10000 });
    });

    test('should sanitize inputs to prevent XSS (Security)', async ({ page }) => {
        const authPage = new AuthPage(page);
        const vanPage = new VanPlannerPage(page);

        // 1. Setup Base Mocks
        await authPage.mockLoginSuccess();

        // 2. Override Plans Mock with XSS Payload
        // We assume this endpoint is called after login to list plans
        await page.route('**/plans', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([
                    { id: 1, name: '<script>alert("XSS")</script>', items: [] }
                ]),
            });
        });

        // 3. Setup dialog listener
        let dialogCount = 0;
        page.on('dialog', dialog => {
            dialogCount++;
            dialog.dismiss();
        });

        // 4. Go to Login Page
        await vanPage.goto();

        // 5. Perform UI Login
        await authPage.login();

        // 6. Verify no alert was triggered
        expect(dialogCount).toBe(0);

        // Optional: Verify app loaded
        await expect(vanPage.canvasContainer).toBeVisible({ timeout: 10000 });
    });
});
