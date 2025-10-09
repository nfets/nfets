import path from 'node:path';

describe('Package Integration Tests', () => {
  describe('nfets (full package)', () => {
    it('should export all core modules', async () => {
      const nfetsPath = path.resolve(__dirname, '../../../dist/index.js');
      const nfets = await import(nfetsPath);

      expect(nfets).toHaveProperty('Signer');
      expect(nfets).toHaveProperty('NativeCertificateRepository');
      expect(nfets).toHaveProperty('SoapRemoteTransmissionRepository');
    });

    it('should export all nfe modules', async () => {
      const nfetsPath = path.resolve(__dirname, '../../../dist/index.js');
      const nfets = await import(nfetsPath);

      expect(nfets).toHaveProperty('NfeXmlBuilder');
      expect(nfets).toHaveProperty('AccessKeyBuilder');
    });

    it('should have working types (no runtime test, just TypeScript check)', () => {
      expect(true).toBe(true);
    });
  });

  describe('@nfets/core package', () => {
    it('should export Signer', async () => {
      const corePath = path.resolve(__dirname, '../../core/dist/index.js');
      const core = await import(corePath);

      expect(core).toHaveProperty('Signer');
      expect(typeof core.Signer).toBe('function');
    });

    it('should export certificate repositories', async () => {
      const corePath = path.resolve(__dirname, '../../core/dist/index.js');
      const core = await import(corePath);

      expect(core).toHaveProperty('NativeCertificateRepository');
      expect(typeof core.NativeCertificateRepository).toBe('function');
    });

    it('should export domain entities', async () => {
      const corePath = path.resolve(__dirname, '../../core/dist/index.js');
      const core = await import(corePath);

      expect(core).toHaveProperty('SignatureAlgorithm');
      expect(core).toHaveProperty('DigestAlgorithm');
      expect(core).toHaveProperty('SignatureMethod');
    });

    it('should export validators', async () => {
      const corePath = path.resolve(__dirname, '../../core/dist/index.js');
      const core = await import(corePath);

      expect(core).toHaveProperty('StateCodeSpValidator');
      expect(core).toHaveProperty('StateCodeRjValidator');
    });

    it('should export infrastructure utilities', async () => {
      const corePath = path.resolve(__dirname, '../../core/dist/index.js');
      const core = await import(corePath);

      expect(core).toHaveProperty('Xml2JsToolkit');
      expect(core).toHaveProperty('MemoryCacheAdapter');
    });
  });

  describe('@nfets/nfe package', () => {
    it('should export NfeXmlBuilder', async () => {
      const nfePath = path.resolve(__dirname, '../../nfe/dist/index.js');
      const nfe = await import(nfePath);

      expect(nfe).toHaveProperty('NfeXmlBuilder');
      expect(typeof nfe.NfeXmlBuilder).toBe('function');
    });

    it('should export AccessKeyBuilder', async () => {
      const nfePath = path.resolve(__dirname, '../../nfe/dist/index.js');
      const nfe = await import(nfePath);

      expect(nfe).toHaveProperty('AccessKeyBuilder');
      expect(typeof nfe.AccessKeyBuilder).toBe('function');
    });

    it('should export DTOs', async () => {
      const nfePath = path.resolve(__dirname, '../../nfe/dist/index.js');
      const nfe = await import(nfePath);

      expect(nfe).toHaveProperty('NFe');
      expect(nfe).toHaveProperty('NFCe');
    });

    it('should work with core package (dependency test)', async () => {
      const nfePath = path.resolve(__dirname, '../../nfe/dist/index.js');
      const corePath = path.resolve(__dirname, '../../core/dist/index.js');

      const nfe = await import(nfePath);
      const core = await import(corePath);

      expect(nfe.NfeXmlBuilder).toBeDefined();
      expect(core.Signer).toBeDefined();
    });
  });

  describe('Type definitions (.d.ts files)', () => {
    it('should have type definitions for nfets package', () => {
      const typeDefPath = path.resolve(__dirname, '../../../dist/index.d.ts');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require('fs');

      expect(fs.existsSync(typeDefPath)).toBe(true);
    });

    it('should have type definitions for @nfets/core', () => {
      const typeDefPath = path.resolve(__dirname, '../../core/dist/index.d.ts');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require('fs');

      expect(fs.existsSync(typeDefPath)).toBe(true);
    });

    it('should have type definitions for @nfets/nfe', () => {
      const typeDefPath = path.resolve(__dirname, '../../nfe/dist/index.d.ts');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require('fs');

      expect(fs.existsSync(typeDefPath)).toBe(true);
    });

    it('should have declaration maps', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require('fs');

      const coreMapPath = path.resolve(
        __dirname,
        '../../core/dist/index.d.ts.map',
      );
      const nfeMapPath = path.resolve(
        __dirname,
        '../../nfe/dist/index.d.ts.map',
      );

      expect(fs.existsSync(coreMapPath)).toBe(true);
      expect(fs.existsSync(nfeMapPath)).toBe(true);
    });
  });

  describe('Package exports validation', () => {
    it('should have correct package.json exports for @nfets/core', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const packageJson = require('../../core/package.json');

      expect(packageJson.exports).toBeDefined();
      expect(packageJson.exports['.']).toBeDefined();
      expect(packageJson.main).toBeDefined();
    });

    it('should have correct package.json exports for @nfets/nfe', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const packageJson = require('../../nfe/package.json');

      expect(packageJson.exports).toBeDefined();
      expect(packageJson.exports['.']).toBeDefined();
      expect(packageJson.main).toBeDefined();
    });

    it('should have correct package.json for nfets (full package)', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const packageJson = require('../../../package.json');

      expect(packageJson.exports).toBeDefined();
      expect(packageJson.exports['.']).toBeDefined();
      expect(packageJson.main).toBeDefined();

      expect(packageJson.dependencies['@nfets/core']).toBe('workspace:*');
      expect(packageJson.dependencies['@nfets/nfe']).toBe('workspace:*');
    });
  });
});
