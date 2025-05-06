import config from '../test/src/jest.config';

export default {
  ...config,
  coveragePathIgnorePatterns: ['src/index.ts'],
  coverageThreshold: {
    global: {
      statements: 95,
      branches: 70,
      lines: 95,
      functions: 100,
    },
  },
};
