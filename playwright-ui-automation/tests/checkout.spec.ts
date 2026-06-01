import { test, expect } from '../fixtures/base.fixture';
import { CheckoutData } from '../data/checkout.data';

// Auth provided by project-level storageState (set in playwright.config.ts)
// beforeEach drives each test to the cart page independently — no shared state

const PRODUCT = 'Sauce Labs Backpack';

test.describe('Shopping Cart & Checkout', () => {
  test.beforeEach(async ({ page, inventoryPage }) => {
    // Each test starts fresh: navigate → add product → go to cart
    await page.goto('/inventory.html');
    await inventoryPage.addProductToCart(PRODUCT);
    await inventoryPage.goToCart();
  });

  test('should complete full checkout flow successfully', async ({
    cartPage,
    checkoutPage,
  }) => {
    await cartPage.assertProductInCart(PRODUCT);
    await cartPage.proceedToCheckout();
    await checkoutPage.assertOnCheckoutStepOne();
    await checkoutPage.fillCheckoutInfo(CheckoutData.VALID);
    await checkoutPage.clickContinue();
    await checkoutPage.assertOnCheckoutStepTwo();
    await checkoutPage.clickFinish();
    await checkoutPage.assertOrderComplete();
  });

  test('should show error when first name is missing', async ({ cartPage, checkoutPage }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo(CheckoutData.MISSING_FIRST_NAME);
    await checkoutPage.clickContinue();
    await checkoutPage.assertErrorMessage('First Name is required');
  });

  test('should show error when last name is missing', async ({ cartPage, checkoutPage }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo(CheckoutData.MISSING_LAST_NAME);
    await checkoutPage.clickContinue();
    await checkoutPage.assertErrorMessage('Last Name is required');
  });

  test('should show error when postal code is missing', async ({ cartPage, checkoutPage }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo(CheckoutData.MISSING_POSTAL_CODE);
    await checkoutPage.clickContinue();
    await checkoutPage.assertErrorMessage('Postal Code is required');
  });
});
