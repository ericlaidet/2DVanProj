// ----------------------------------------------------------------------------
// 15. ACCESSIBILITY TESTS (tests/a11y/wcag-compliance.spec.ts)
// ----------------------------------------------------------------------------
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility (WCAG 2.1 AA)', () => {
  
  test('login page has no accessibility violations', async ({ page }) => {
    await page.goto('/login');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('editor page has no accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation works throughout app', async ({ page }) => {
    await page.goto('/');
    
    // Tab through navigation buttons
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Plans' })).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Profil' })).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Paramètres' })).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Déconnexion' })).toBeFocused();
  });

  test('screen reader labels are present', async ({ page }) => {
    await page.goto('/');
    
    // Check ARIA labels
    const saveBtn = page.getByRole('button', { name: 'Sauvegarder' });
    const ariaLabel = await saveBtn.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });

  test('color contrast meets WCAG AA standards', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa', 'wcag21aa'])
      .analyze();
    
    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    );
    expect(contrastViolations).toEqual([]);
  });
});
