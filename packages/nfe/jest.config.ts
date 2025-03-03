import config from '../test/src/jest.config';

export default {
  ...config,
  coveragePathIgnorePatterns: ['src/index.ts'],
};
