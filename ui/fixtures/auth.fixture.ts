import { test as base } from './base.fixture';
import { STORAGE_STATE } from '../playwright.config';

// All tests using this fixture start pre-authenticated.
// The storageState file is created once by auth.setup.ts before any test runs.
export const test = base.extend({
  storageState: STORAGE_STATE,
});

export { expect } from '@playwright/test';
