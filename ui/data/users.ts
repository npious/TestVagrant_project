import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

export const Users = {
  STANDARD: process.env.USER_STANDARD!,
  LOCKED_OUT: process.env.USER_LOCKED_OUT!,
  PROBLEM: process.env.USER_PROBLEM!,
  PERFORMANCE_GLITCH: process.env.USER_PERFORMANCE_GLITCH!,
  ERROR: process.env.USER_ERROR!,
  VISUAL: process.env.USER_VISUAL!,
} as const;

export const Password = {
  VALID: process.env.STANDARD_PASSWORD!,
  INVALID: 'wrong_password',
} as const;

export type UserKey = keyof typeof Users;
