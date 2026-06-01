export const InventoryLocators = {
  pageTitle: '[data-test="title"]',
  inventoryList: '[data-test="inventory-list"]',
  inventoryItem: '[data-test="inventory-item"]',
  addToCartButton: (productName: string) =>
    `[data-test="add-to-cart-${productName.toLowerCase().replace(/ /g, '-')}"]`,
  removeButton: (productName: string) =>
    `[data-test="remove-${productName.toLowerCase().replace(/ /g, '-')}"]`,
  cartBadge: '[data-test="shopping-cart-badge"]',
  cartLink: '[data-test="shopping-cart-link"]',
  sortDropdown: '[data-test="product-sort-container"]',
} as const;
