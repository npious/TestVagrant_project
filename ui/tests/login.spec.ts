import { test, expect } from '../fixtures/base.fixture';
import { Users, Password } from '../data/users';

// Override project-level storageState — login tests must always start unauthenticated
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login Module', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(Users.STANDARD, Password.VALID);
    await inventoryPage.assertOnInventoryPage();
    await inventoryPage.assertInventoryLoaded();
  });

  test('should show error with invalid password', async ({ loginPage }) => {
    await loginPage.login(Users.STANDARD, Password.INVALID);
    await loginPage.assertErrorMessage('Username and password do not match');
  });

  test('should show error for locked out user', async ({ loginPage }) => {
    await loginPage.login(Users.LOCKED_OUT, Password.VALID);
    await loginPage.assertErrorMessage('Sorry, this user has been locked out');
  });

  test('should show error when username is empty', async ({ loginPage }) => {
    await loginPage.login('', Password.VALID);
    await loginPage.assertErrorMessage('Username is required');
  });

  test('should show error when password is empty', async ({ loginPage }) => {
    await loginPage.login(Users.STANDARD, '');
    await loginPage.assertErrorMessage('Password is required');
  });
});
