import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve('..', '..', '.env') });

export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  workerIdleMemoryLimit: '2048MB',
  maxWorkers: '90%',
  maxConcurrency: 5,
  passWithNoTests: true,
  detectOpenHandles: true,
  forceExit: true,
  testRegex: '.*\\.spec\\.ts$',
  coverageThreshold: {
    global: {
      statements: 98,
      branches: 98,
      lines: 98,
      functions: 98,
    },
  },
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: './tsconfig.json' }],
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^test/(.*)$': '<rootDir>/test/$1',
    '^@nfets/test/(.*)$': '<rootDir>/../test/src/$1',
    '^@nfets/core$': '<rootDir>/../core/src/index.ts',
    '^@nfets/core/(.*)$': '<rootDir>/../core/src/$1',
  },
  coverageReporters: [['text', { skipFull: true }]],
  testPathIgnorePatterns: ['/node_modules/', '/coverage/', '/dist/'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
};
