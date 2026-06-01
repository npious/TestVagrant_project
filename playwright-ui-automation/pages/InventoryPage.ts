import { Page, expect } from '@playwright/test';
import { InventoryLocators } from '../locators/inventory.locators';

export class InventoryPage {
  constructor(private page: Page) {}

  async assertOnInventoryPage() {
    await expect(this.page).toHaveURL(/inventory/);
    await expect(this.page.locator(InventoryLocators.pageTitle)).toHaveText('Products');
  }

  async addProductToCart(productName: string) {
    await this.page.click(InventoryLocators.addToCartButton(productName));
  }

  async assertCartBadgeCount(count: number) {
    await expect(this.page.locator(InventoryLocators.cartBadge)).toHaveText(String(count));
  }

  async assertCartBadgeNotVisible() {
    await expect(this.page.locator(InventoryLocators.cartBadge)).not.toBeVisible();
  }

  async goToCart() {
    await this.page.click(InventoryLocators.cartLink);
  }

  async assertInventoryLoaded() {
    await expect(this.page.locator(InventoryLocators.inventoryList)).toBeVisible();
  }
}
