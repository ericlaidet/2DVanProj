// ----------------------------------------------------------------------------
// 9. MULTI-USER ISOLATION TESTS (tests/security/multi-user.spec.ts)
// ----------------------------------------------------------------------------
import { test, expect, testUsers } from '../fixtures';

test.describe('Multi-User Security & Isolation', () => {
  
  test('user cannot see other users plans', async ({ browser }) => {
    // Create two separate contexts (two users)
    const user1Context = await browser.newContext();
    const user2Context = await browser.newContext();
    
    const user1Page = await user1Context.newPage();
    const user2Page = await user2Context.newPage();
    
    // User 1 logs in and creates plan
    await user1Page.goto('/login');
    await user1Page.getByPlaceholder('Email').fill(testUsers.pro1.email);
    await user1Page.getByPlaceholder('Mot de passe').fill(testUsers.pro1.password);
    await user1Page.getByRole('button', { name: 'Se connecter' }).click();
    await user1Page.waitForURL('/');
    
    const user1PlanName = `User1 Plan ${Date.now()}`;
    await user1Page.getByRole('button', { name: 'Sauvegarder' }).click();
    await user1Page.getByPlaceholder(/nom/i).fill(user1PlanName);
    await user1Page.getByRole('button', { name: 'Confirmer' }).click();
    
    // User 2 logs in
    await user2Page.goto('/login');
    await user2Page.getByPlaceholder('Email').fill(testUsers.pro2.email);
    await user2Page.getByPlaceholder('Mot de passe').fill(testUsers.pro2.password);
    await user2Page.getByRole('button', { name: 'Se connecter' }).click();
    await user2Page.waitForURL('/');
    
    // Verify User 2 CANNOT see User 1's plan
    const planList = user2Page.locator('.plan-list select option');
    const planTexts = await planList.allTextContents();
    expect(planTexts).not.toContain(user1PlanName);
    
    // Cleanup
    await user1Context.close();
    await user2Context.close();
  });

  test('JWT token is user-specific', async ({ page, request }) => {
    await page.goto('/login');
    await page.getByPlaceholder('Email').fill(testUsers.pro1.email);
    await page.getByPlaceholder('Mot de passe').fill(testUsers.pro1.password);
    await page.getByRole('button', { name: 'Se connecter' }).click();
    
    const token1 = await page.evaluate(() => localStorage.getItem('token'));
    
    // Logout and login as different user
    await page.getByRole('button', { name: 'Déconnexion' }).click();
    await page.goto('/login');
    await page.getByPlaceholder('Email').fill(testUsers.pro2.email);
    await page.getByPlaceholder('Mot de passe').fill(testUsers.pro2.password);
    await page.getByRole('button', { name: 'Se connecter' }).click();
    
    const token2 = await page.evaluate(() => localStorage.getItem('token'));
    
    // Tokens should be different
    expect(token1).not.toBe(token2);
  });

  test('expired token redirects to login', async ({ page }) => {
    await page.goto('/');
    
    // Set expired token
    await page.evaluate(() => {
      localStorage.setItem('token', 'expired.jwt.token');
    });
    
    await page.reload();
    
    // Should redirect to login
    await expect(page).toHaveURL('/login');
  });

  test('API requests without token return 401', async ({ request }) => {
    const response = await request.get('/plans', {
      headers: { 'Authorization': 'Bearer invalid-token' }
    });
    
    expect(response.status()).toBe(401);
  });
});
