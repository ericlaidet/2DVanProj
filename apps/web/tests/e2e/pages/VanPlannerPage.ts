import { type Page, type Locator, expect } from '@playwright/test';

export class VanPlannerPage {
    readonly page: Page;
    readonly vanSelectorButton: Locator;
    readonly furniturePalette: Locator;
    readonly canvasContainer: Locator;

    constructor(page: Page) {
        this.page = page;

        // Selectors using User-Facing attributes (Role, Text)
        this.vanSelectorButton = page.getByRole('button', { name: /sélectionner un van/i });
        this.furniturePalette = page.locator('.furniture-palette');
        this.canvasContainer = page.locator('.canvas-container');
    }

    async goto() {
        await this.page.goto('/');
    }

    /**
     * Selects a specific van type from the modal
     */
    async selectVan(vanName: string) {
        // Open selector if not already open (assumes button always exists)
        if (await this.vanSelectorButton.isVisible()) {
            await this.vanSelectorButton.click();
        }

        // Click the van card/button
        await this.page.getByText(vanName, { exact: false }).first().click();

        // Wait for modal to close or van to be selected
        // We verify that the van selector button is visible again (modal closed) 
        // OR we can check if "Dimension van" text appears which confirms selection
        // await expect(this.page.getByText('Dimension van', { exact: false })).toBeVisible({ timeout: 5000 });

        // Small stability wait as seen in debug test
        await this.page.waitForTimeout(2000);
    }

    /**
     * Adds a furniture item from the palette
     * @param furnitureName Name of the furniture (e.g., "Lit", "Cuisine")
     */
    async addFurniture(furnitureName: string) {
        // Use the robust selector from debug-add-furniture.spec.ts
        // The items are divs with class 'element-card', not buttons
        const card = this.page.locator('.element-card').filter({ hasText: furnitureName }).first();
        await card.click();
    }

    /**
     * Returns the number of furniture items in the store/canvas
     * (We might need to check the DOM for rendered elements or listen to console logs/network)
     * For now, checking the list in the side panel or canvas elements
     */
    async getFurnitureCount() {
        // Use the robust selector from furniture-addition.spec.ts
        // It seems elements in the canvas or list have this attribute
        return await this.page.locator('[data-furniture-id]').count();
    }
}
