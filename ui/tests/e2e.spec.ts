import { test, expect } from '../fixtures/base.fixture';
import { Users, Password } from '../data/users';
import { CheckoutData } from '../data/checkout.data';

// Override storageState — E2E test owns the full journey including login
test.use({ storageState: { cookies: [], origins: [] } });

const PRODUCT = 'Sauce Labs Backpack';

test.describe('E2E: Login → Add to Cart → Checkout', () => {
  test('should complete full purchase journey from login to order confirmation', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    // Step 1: Navigate to login page and authenticate
    await loginPage.goto(); // navigate
    await loginPage.login(Users.STANDARD, Password.VALID);
    await inventoryPage.assertOnInventoryPage();

    // Step 2: Add product to cart
    await inventoryPage.assertInventoryLoaded();
    await inventoryPage.addProductToCart(PRODUCT);
    await inventoryPage.assertCartBadgeCount(1);

    // Step 3: Go to cart and verify product is present
    await inventoryPage.goToCart();
    await cartPage.assertOnCartPage();
    await cartPage.assertProductInCart(PRODUCT);

    // Step 4: Proceed to checkout and fill in details
    await cartPage.proceedToCheckout();
    await checkoutPage.assertOnCheckoutStepOne();
    await checkoutPage.fillCheckoutInfo(CheckoutData.VALID);
    await checkoutPage.clickContinue();

    // Step 5: Review order summary and confirm
    await checkoutPage.assertOnCheckoutStepTwo();
    await checkoutPage.clickFinish();

    // Step 6: Verify order completion
    await checkoutPage.assertOrderComplete();
  });
});
