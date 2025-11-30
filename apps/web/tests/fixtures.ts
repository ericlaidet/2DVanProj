// ----------------------------------------------------------------------------
// 2. TEST FIXTURES & HELPERS (tests/fixtures.ts)
// ----------------------------------------------------------------------------
import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';

export const testUsers = {
  free: {
    email: 'free-user@test.com',
    password: 'TestPass123!',
    name: 'Free User',
    subscription: 'FREE'
  },
  pro1: {
    email: 'pro1-user@test.com',
    password: 'TestPass123!',
    name: 'Pro1 User',
    subscription: 'PRO1'
  },
  pro2: {
    email: 'pro2-user@test.com',
    password: 'TestPass123!',
    name: 'Pro2 User',
    subscription: 'PRO2'
  },
  pro3: {
    email: 'pro3-user@test.com',
    password: 'TestPass123!',
    name: 'Pro3 User',
    subscription: 'PRO3'
  }
};

// Page Object Models
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.getByPlaceholder('Email').fill(email);
    await this.page.getByPlaceholder('Mot de passe').fill(password);
    await this.page.getByRole('button', { name: 'Se connecter' }).click();
    
    // Wait for success notification
    await this.page.locator('text=Connexion réussie').waitFor({ timeout: 10000 });
  }

  async register(name: string, email: string, password: string) {
    await this.page.getByRole('button', { name: 'Créer un compte' }).click();
    await this.page.getByPlaceholder('Nom').fill(name);
    await this.page.getByPlaceholder('Email').fill(email);
    await this.page.getByPlaceholder('Mot de passe').fill(password);
    await this.page.getByRole('button', { name: 'Créer un compte' }).click();
  }

  async expectLoginError(message: string) {
    await this.page.locator(`text=${message}`).waitFor();
  }

  async expectDuplicateError(field: 'email' | 'name') {
    const expectedText = field === 'email' 
      ? 'Cet email est déjà utilisé'
      : 'Ce nom d\'utilisateur est déjà pris';
    await this.page.locator(`text=${expectedText}`).waitFor();
  }
}

export class EditorPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async expectWelcomeMessage(userName: string, subscription: string) {
    const welcome = this.page.locator('.user-info');
    await welcome.waitFor();
    await expect(welcome).toContainText(`Bienvenue, ${userName}`);
    await expect(welcome).toContainText(`Abonnement: ${subscription}`);
  }

  async clickNavButton(button: 'Plans' | 'Profil' | 'Paramètres' | 'Déconnexion') {
    await this.page.getByRole('button', { name: button }).click();
  }

  async selectVan(vanType: string) {
    await this.page.getByRole('button', { name: /Sélectionner un van/ }).click();
    await this.page.locator(`[data-van-type="${vanType}"]`).click();
  }

  async savePlan(planName: string) {
    await this.page.getByRole('button', { name: 'Sauvegarder' }).click();
    await this.page.getByPlaceholder(/nom du plan/i).fill(planName);
    await this.page.getByRole('button', { name: 'Confirmer' }).click();
  }

  async expectPlanInList(planName: string) {
    await this.page.locator(`text=${planName}`).waitFor();
  }
}

// Extend base test with fixtures
export const test = base.extend<{
  loginPage: LoginPage;
  editorPage: EditorPage;
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  editorPage: async ({ page }, use) => {
    await use(new EditorPage(page));
  },
});

export { expect } from '@playwright/test';
