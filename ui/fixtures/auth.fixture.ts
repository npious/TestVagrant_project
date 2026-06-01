import { test as base } from './base.fixture';
import * as path from 'path';

export const STORAGE_STATE = path.join(__dirname, '../.auth/user.json');

export const test = base.extend({
  storageState: STORAGE_STATE,
});

export { expect } from '@playwright/test';
