import config from '@nfets/test/jest.config';

export default {
  ...config,
  coveragePathIgnorePatterns: ['src/index.ts'],
};
