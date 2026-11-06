import config from '@nfets/test/jest.config';

export default {
  ...config,
  displayName: 'integration',
  // Node --localstorage-file uses SQLite; parallel workers contend and throw
  // "database is locked" (seen on macOS + Node 26 in CI).
  maxWorkers: 1,
  testMatch: ['**/*.integration.spec.ts', '**/integration*.spec.ts'],
  testRegex: void 0,
};
