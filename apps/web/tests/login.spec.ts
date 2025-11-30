// apps/web/tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { VALID, WRONG_PASSWORD, INVALID_EMAIL } from './credentials';
import fs from 'fs';

test.describe('Login - scénarios basiques', () => {
	// Ajuste ce chemin si ta page de login est /signin ou /auth
	const loginPath = '/login';

	test.beforeEach(async ({ page }) => {
		// Utilise la baseURL du config, donc goto('/login') -> http://localhost:5173/login
		await page.goto(loginPath);
	});

	test('affiche une erreur pour mot de passe incorrect', async ({ page }) => {
		// Ajuste sélecteurs selon ton DOM : ici on suppose name/email/password et bouton "Se connecter"
		await page.getByPlaceholder('Email').fill(WRONG_PASSWORD.email);
		await page.getByPlaceholder('Mot de passe').fill(WRONG_PASSWORD.password);
		await page.click('button:has-text("Se connecter")');

		// Attends et vérifie un message d'erreur visible
		// adapte le sélecteur si ton app montre une alert, un toast, ou un paragraphe .error
		const error = page.locator('text=Identifiants incorrects').first();
		await expect(error).toBeVisible();
	});

	test('affiche une erreur pour adresse e-mail invalide', async ({ page }) => {
		await page.getByPlaceholder('Email').fill(INVALID_EMAIL.email);
		await page.getByPlaceholder('Mot de passe').fill(INVALID_EMAIL.password);
		await page.click('button:has-text("Se connecter")');

		// Attends et vérifie un message d'erreur visible
		// adapte le sélecteur si ton app montre une alert, un toast, ou un paragraphe .error
		const error = page.locator('text=Il manque un symbole').first();
		await expect(error).toBeVisible();
	});

	test('login réussi -> sauvegarde token dans storageState.json', async ({ browser }) => {
		const context = await browser.newContext();
		const page = await context.newPage();

		// 1️⃣ Aller sur la page de login
		await page.goto('/login');

		// 2️⃣ Remplir les champs
		await page.getByPlaceholder('Email').fill(VALID.email);
		await page.getByPlaceholder('Mot de passe').fill(VALID.password);

		// 3️⃣ Cliquer sur "Se connecter"
		await page.getByRole('button', { name: 'Se connecter' }).click();

		// 4️⃣ Attendre le modal de succès
		// (texte exact : "Connexion réussie" d’après ce que tu m’as dit)
		const successModal = page.locator('text=Connexion réussie');
		await expect(successModal).toBeVisible({ timeout: 10_000 });

		// 5️⃣ Attendre que le header principal soit visible (preuve qu’on est sur la page principale)
		const headerTitle = page.locator('h1.header-title');
		await expect(headerTitle).toContainText('Plan your Van - Éditeur 2D');

		// 6️⃣ Essayer de récupérer le token dans localStorage (si ton app l’utilise)
		const token = await page.evaluate(() => {
			// Remplace "token" si ton app stocke le token sous un autre nom
			return window.localStorage.getItem('token');
		});

		if (token) {
			console.log('✅ Token récupéré :', token);
		} else {
			console.log('⚠️ Aucun token trouvé dans localStorage');
		}

		// 7️⃣ Sauvegarder tout l’état (cookies + localStorage)
		await context.storageState({ path: 'tests/storageState.json' });

		// Vérifier que le fichier a bien été créé
		expect(fs.existsSync('tests/storageState.json')).toBeTruthy();

		await context.close();
	});

});
