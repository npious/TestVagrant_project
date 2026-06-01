import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { Users, Password } from '../data/users';
import { STORAGE_STATE } from '../fixtures/auth.fixture';

setup('authenticate as standard user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goto();
  await loginPage.login(Users.STANDARD, Password.VALID);
  await inventoryPage.assertOnInventoryPage();

  await page.context().storageState({ path: STORAGE_STATE });
});
