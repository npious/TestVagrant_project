import { test, expect } from '../fixtures/base.fixture';

// Auth provided by project-level storageState (set in playwright.config.ts)
// Each test gets a fresh browser context — cart is always empty at the start

const PRODUCT_1 = 'Sauce Labs Backpack';
const PRODUCT_2 = 'Sauce Labs Bike Light';

test.describe('Product Catalog', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a clean inventory page before every test
    await page.goto('/inventory.html');
  });

  test('should add a product to cart and update badge count', async ({ inventoryPage }) => {
    await inventoryPage.assertCartBadgeNotVisible();
    await inventoryPage.addProductToCart(PRODUCT_1);
    await inventoryPage.assertCartBadgeCount(1);
  });

  test('should add multiple products and reflect correct badge count', async ({ inventoryPage }) => {
    await inventoryPage.addProductToCart(PRODUCT_1);
    await inventoryPage.addProductToCart(PRODUCT_2);
    await inventoryPage.assertCartBadgeCount(2);
  });

  test('should navigate to cart and show added product', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addProductToCart(PRODUCT_1);
    await inventoryPage.goToCart();
    await cartPage.assertOnCartPage();
    await cartPage.assertProductInCart(PRODUCT_1);
  });

  test('should show empty cart when no items added', async ({ inventoryPage }) => {
    // Each test starts with a fresh context — no leftover cart items from other tests
    await inventoryPage.assertCartBadgeNotVisible();
  });
});
