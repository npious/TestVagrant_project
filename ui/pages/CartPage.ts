import { Page, expect } from '@playwright/test';
import { CartLocators } from '../locators/cart.locators';

export class CartPage {
  constructor(private page: Page) {}

  async assertOnCartPage() {
    await expect(this.page).toHaveURL(/cart/);
    await expect(this.page.locator(CartLocators.pageTitle)).toHaveText('Your Cart');
  }

  async assertProductInCart(productName: string) {
    await expect(
      this.page.locator(CartLocators.cartItemName, { hasText: productName })
    ).toBeVisible();
  }

  async assertCartIsEmpty() {
    await expect(this.page.locator(CartLocators.cartItem)).toHaveCount(0);
  }

  async proceedToCheckout() {
    await this.page.click(CartLocators.checkoutButton);
  }
}
