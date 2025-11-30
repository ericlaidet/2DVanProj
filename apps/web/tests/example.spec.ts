import { test, expect } from '@playwright/test';

test('homepage has title and links to docs', async ({ page }) => {
  // 🧭 Ouvre ton site local (ajuste le port)
  await page.goto('http://localhost:5173');

  // ✅ Vérifie que le titre contient un mot clé
  await expect(page).toHaveTitle("Plan Your Van");

  // 🔍 Vérifie la présence d’un texte ou bouton
  const button = page.getByRole('button', { name: 'Se connecter' });
  await expect(button).toBeVisible();
});
