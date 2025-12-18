import { type Page, type Locator, expect } from '@playwright/test';

export class AuthPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.getByPlaceholder('Email');
        this.passwordInput = page.getByPlaceholder('Mot de passe');
        this.loginButton = page.getByRole('button', { name: 'Se connecter' });
    }

    async goto() {
        await this.page.goto('/');
    }

    /**
     * Helper to mock successful backend authentication
     * Call this BEFORE any navigation if you want to bypass real backend
     */
    async mockLoginSuccess(name = 'Test User', email = 'test@example.com') {
        // Mock Login Endpoint
        await this.page.route('**/auth/login', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    access_token: 'fake-jwt-token',
                    user: { name, email, subscription: 'PRO' }
                })
            });
        });

        // Mock Profile Endpoint (called by useAuth on reload)
        await this.page.route('**/auth/profile', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ name, email, subscription: 'PRO' })
            });
        });

        // Mock Settings Endpoint
        await this.page.route('**/users/settings', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ theme: 'light' })
            });
        });
    }

    /**
     * Perform UI Login action
     */
    async login(email = 'test@example.com', password = 'password') {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();

        // Wait for login to complete (e.g. check for redirection or header)
        // We can wait for the "Se connecter" button to disappear
        await expect(this.loginButton).toBeHidden();
    }
}
