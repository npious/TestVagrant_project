import { test as setup } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { Users, Password } from '../data/users';

export const STORAGE_STATE = path.join(__dirname, '../.auth/user.json');

setup('authenticate as standard user', async ({ page }) => {
  // Ensure .auth directory exists on every runner/shard before writing
  const authDir = path.dirname(STORAGE_STATE);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goto();
  await loginPage.login(Users.STANDARD, Password.VALID);
  await inventoryPage.assertOnInventoryPage();

  await page.context().storageState({ path: STORAGE_STATE });
});
