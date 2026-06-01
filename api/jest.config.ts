import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.spec.ts'],
  setupFiles: ['./jest.setup.ts'],
  verbose: true,
  testTimeout: 30000,
  collectCoverageFrom: ['clients/**/*.ts', 'utils/**/*.ts'],
  coverageDirectory: 'coverage',
};

export default config;
