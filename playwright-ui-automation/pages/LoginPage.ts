import { Page, expect } from '@playwright/test';
import { LoginLocators } from '../locators/login.locators';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.page.fill(LoginLocators.usernameInput, username);
    await this.page.fill(LoginLocators.passwordInput, password);
    await this.page.click(LoginLocators.loginButton);
  }

  async assertErrorMessage(message: string) {
    await expect(this.page.locator(LoginLocators.errorMessage)).toContainText(message);
  }

  async assertErrorVisible() {
    await expect(this.page.locator(LoginLocators.errorMessage)).toBeVisible();
  }
}
