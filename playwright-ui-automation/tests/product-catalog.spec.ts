import { test, expect } from '../fixtures/base.fixture';
import { Users, Password } from '../data/users';

// Auth provided by project-level storageState (set in playwright.config.ts)
// Each test gets a fresh browser context — cart is always empty at the start

const PRODUCT_1 = 'Sauce Labs Backpack';
const PRODUCT_2 = 'Sauce Labs Bike Light';

// ─── Positive Scenarios ───────────────────────────────────────────────────────
test.describe('Product Catalog - Positive', () => {
  test.beforeEach(async ({ page }) => {
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

  test('should show empty cart badge when no items added', async ({ inventoryPage }) => {
    await inventoryPage.assertCartBadgeNotVisible();
  });
});

// ─── Negative Scenarios ───────────────────────────────────────────────────────
test.describe('Product Catalog - Negative', () => {

  // Scenario 1: problem_user — product images are broken (shows wrong image)
  // This user has a known defect where all product images point to the wrong src
  // Verifies the defect is detectable — image src should NOT contain the correct product name
  test('problem_user: product images should be broken/incorrect', async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    await page.context().clearCookies();
    await loginPage.goto();
    await loginPage.login(Users.PROBLEM, Password.VALID);
    await inventoryPage.assertOnInventoryPage();

    // For problem_user all product images point to /static/media/sl-404.168b1cce.jpg
    // instead of their correct image — assert the defect exists
    const productImages = page.locator('.inventory_item img');
    const firstImageSrc = await productImages.first().getAttribute('src');
    expect(firstImageSrc).toContain('sl-404');
  });

  // Scenario 2: Accessing cart directly without adding any product
  // Cart should be empty — no items, checkout should still be accessible
  test('cart should be empty when navigating directly without adding products', async ({
    page,
    cartPage,
  }) => {
    await page.goto('/cart.html');
    await cartPage.assertOnCartPage();
    await cartPage.assertCartIsEmpty();
  });

  // Scenario 3: Accessing a product detail page with an invalid/missing id
  // SauceDemo redirects or shows broken content — page should not crash
  test('should handle direct navigation to inventory item without valid id', async ({ page }) => {
    await page.goto('/inventory-item.html');
    const backButton = page.locator('[data-test="back-to-products"]');
    await expect(backButton).toBeVisible();
    });
});
