import config from '@nfets/test/jest.config';

export default {
  ...config,
  displayName: 'integration',
  testMatch: ['**/*.integration.spec.ts', '**/integration*.spec.ts'],
  testRegex: void 0,
};
