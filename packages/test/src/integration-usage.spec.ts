import path from 'node:path';
import {
  getCnpjCertificate,
  getCertificatePassword,
} from '../src/certificates';

describe('Real-world Usage Simulation', () => {
  describe('Using @nfets/core for signing', () => {
    it('should be able to create a XmlSigner instance', async () => {
      const corePath = path.resolve(__dirname, '../../core/dist/index.js');
      const { XmlSigner, NativeCertificateRepository } = await import(corePath);

      const certificatePath = getCnpjCertificate();
      const password = getCertificatePassword();

      const certificateRepository = new NativeCertificateRepository({
        pfx: certificatePath,
        password,
      });

      const signer = new XmlSigner(certificateRepository);

      expect(signer).toBeDefined();
      expect(typeof signer.sign).toBe('function');
    });

    it('should be able to create a EntitySigner instance', async () => {
      const corePath = path.resolve(__dirname, '../../core/dist/index.js');
      const { EntitySigner, NativeCertificateRepository } = await import(
        corePath
      );

      const certificatePath = getCnpjCertificate();
      const password = getCertificatePassword();

      const certificateRepository = new NativeCertificateRepository({
        pfx: certificatePath,
        password,
      });

      const signer = new EntitySigner(certificateRepository);

      expect(signer).toBeDefined();
      expect(typeof signer.sign).toBe('function');
    });
  });

  describe('Using @nfets/nfe for building NFe XML', () => {
    it('should be able to create an NFe XML using NfeXmlBuilder', async () => {
      const nfePath = path.resolve(__dirname, '../../nfe/dist/index.js');
      const { NfeXmlBuilder } = await import(nfePath);

      const builder = new NfeXmlBuilder();

      expect(builder).toBeDefined();
      expect(typeof builder.infNFe).toBe('function');
      expect(typeof builder.ide).toBe('function');
    });

    it('should be able to generate access key using AccessKeyBuilder', async () => {
      const nfePath = path.resolve(__dirname, '../../nfe/dist/index.js');
      const { AccessKeyBuilder } = await import(nfePath);

      const builder = new AccessKeyBuilder();

      const result = builder.compile({
        year: '24',
        month: '10',
        cUF: '42',
        identification: '12345678000195',
        mod: '55',
        serie: 1,
        nNF: 123,
        tpEmis: 1,
        cNF: 12345678,
      });

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('Using full nfets package', () => {
    it('should have all exports available from single import', async () => {
      const nfetsPath = path.resolve(__dirname, '../../../dist/index.js');
      const nfets = await import(nfetsPath);

      expect(nfets.XmlSigner).toBeDefined();
      expect(nfets.EntitySigner).toBeDefined();
      expect(nfets.NativeCertificateRepository).toBeDefined();
      expect(nfets.NfeXmlBuilder).toBeDefined();
      expect(nfets.AccessKeyBuilder).toBeDefined();

      const { XmlSigner, EntitySigner, NfeXmlBuilder } = nfets;
      expect(typeof XmlSigner).toBe('function');
      expect(typeof EntitySigner).toBe('function');
      expect(typeof NfeXmlBuilder).toBe('function');
    });
  });

  describe('Cross-package integration', () => {
    it('should be able to use @nfets/core and @nfets/nfe together', async () => {
      const corePath = path.resolve(__dirname, '../../core/dist/index.js');
      const nfePath = path.resolve(__dirname, '../../nfe/dist/index.js');

      const core = await import(corePath);
      const nfe = await import(nfePath);

      const certificatePath = getCnpjCertificate();
      const password = getCertificatePassword();

      const certificateRepository = new core.NativeCertificateRepository({
        pfx: certificatePath,
        password,
      });

      const signer = new core.XmlSigner(certificateRepository);
      const nfeBuilder = new nfe.NfeXmlBuilder();

      expect(signer).toBeDefined();
      expect(nfeBuilder).toBeDefined();
    });
  });

  describe('Error handling and Either type', () => {
    it('should properly export and use Either type from @nfets/core', async () => {
      const corePath = path.resolve(__dirname, '../../core/dist/index.js');
      const { left, right } = await import(corePath);

      const successResult = right('success');
      const errorResult = left(new Error('error'));

      expect(successResult.isRight()).toBe(true);
      expect(successResult.isLeft()).toBe(false);
      expect(errorResult.isRight()).toBe(false);
      expect(errorResult.isLeft()).toBe(true);
    });
  });

  describe('Validators and decorators', () => {
    it('should export validation decorators from @nfets/core', async () => {
      const corePath = path.resolve(__dirname, '../../core/dist/index.js');
      const core = await import(corePath);

      expect(core.Validates).toBeDefined();
      expect(core.TransformDecimal).toBeDefined();
      expect(core.Choice).toBeDefined();
      expect(core.TransformDateString).toBeDefined();
    });
  });
});
