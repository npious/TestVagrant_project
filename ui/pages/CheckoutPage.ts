import { Page, expect } from '@playwright/test';
import { CheckoutLocators } from '../locators/checkout.locators';

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class CheckoutPage {
  constructor(private page: Page) {}

  async assertOnCheckoutStepOne() {
    await expect(this.page).toHaveURL(/checkout-step-one/);
  }

  async fillCheckoutInfo(info: CheckoutInfo) {
    await this.page.fill(CheckoutLocators.firstNameInput, info.firstName);
    await this.page.fill(CheckoutLocators.lastNameInput, info.lastName);
    await this.page.fill(CheckoutLocators.postalCodeInput, info.postalCode);
  }

  async clickContinue() {
    await this.page.click(CheckoutLocators.continueButton);
  }

  async clickFinish() {
    await this.page.click(CheckoutLocators.finishButton);
  }

  async assertOnCheckoutStepTwo() {
    await expect(this.page).toHaveURL(/checkout-step-two/);
  }

  async assertOrderComplete() {
    await expect(this.page).toHaveURL(/checkout-complete/);
    await expect(this.page.locator(CheckoutLocators.completeHeader)).toHaveText('Thank you for your order!');
  }

  async assertErrorMessage(message: string) {
    await expect(this.page.locator(CheckoutLocators.errorMessage)).toContainText(message);
  }

  async assertErrorVisible() {
    await expect(this.page.locator(CheckoutLocators.errorMessage)).toBeVisible();
  }
}
