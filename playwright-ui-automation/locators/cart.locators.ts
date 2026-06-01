export const CartLocators = {
  pageTitle: '[data-test="title"]',
  cartItem: '[data-test="cart-item"]',
  cartItemName: '[data-test="inventory-item-name"]',
  cartItemPrice: '[data-test="inventory-item-price"]',
  removeButton: '[data-test^="remove-"]',
  continueShoppingButton: '[data-test="continue-shopping"]',
  checkoutButton: '[data-test="checkout"]',
} as const;
