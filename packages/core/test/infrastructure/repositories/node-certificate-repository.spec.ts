import axios from 'axios';
import { MemoryCacheAdapter } from '@nfets/core/infrastructure/repositories/memory-cache-adapter';
import { NativeCertificateRepository } from '@nfets/core/infrastructure/repositories/native-certificate-repository';
import {
  expectIsRight,
  expectIsLeft,
  expectNotNull,
} from '@nfets/test/expects';
import {
  getCertificatePassword,
  getCnpjCertificate,
  getCnpjCertificateReadRequest,
  getCpfCertificateReadRequest,
} from '@nfets/test/certificates';
import fs from 'node:fs';
import path from 'node:path';
import { NFeTsError } from '@nfets/core/domain/errors/nfets-error';
import { SignatureAlgorithm } from '@nfets/core/domain/entities/signer/algo';
import { ensurePlatform } from '@nfets/test/ensure-platform';

describe('node certificate repository (unit)', () => {
  const password = getCertificatePassword(),
    validCnpjPfxCertificate = getCnpjCertificate();
  const cnpjCertificateRequest = getCnpjCertificateReadRequest();
  const cpfCertificateRequest = getCpfCertificateReadRequest();

  const repository = new NativeCertificateRepository(
    axios.create(),
    new MemoryCacheAdapter(),
  );

  it('should sucessfully read a valid CNPJ certificate', async () => {
    const result = await repository.read(cnpjCertificateRequest);
    expectIsRight(result);

    const { certificate: certificateInfo } = result.value;

    expect(certificateInfo.subject).toEqual(`C=BR
ST=SP
L=SÃ£o Paulo
O=ICP-Brasil
CN=EMPRESA DE TESTE:79839601000142
OU=AC SOLUTI Multipla v5
emailAddress=email@example.com`);
    expect(certificateInfo.subjectAltName).toContain(`email:email@example.com`);
    expect(certificateInfo.issuer).toEqual(`C=BR
ST=SP
L=SÃ£o Paulo
O=ICP-Brasil
CN=EMPRESA DE TESTE:79839601000142
OU=AC SOLUTI Multipla v5
emailAddress=email@example.com`);

    expect(certificateInfo.serialNumber).toEqual(
      '53936274827C03FE661A6517AF66760A63A6910C',
    );
    expect(certificateInfo.validFromDate).toEqual(
      new Date('2025-12-20T01:11:27.000Z'),
    );
    expect(certificateInfo.validToDate).toEqual(
      new Date('2035-12-18T01:11:27.000Z'),
    );
  });

  it('should sucessfully read a valid CPF certificate', async () => {
    const result = await repository.read(cpfCertificateRequest);
    expectIsRight(result);

    const { certificate: certificateInfo } = result.value;

    expect(certificateInfo.subject).toEqual(`C=BR
ST=SP
L=SÃ£o Paulo
O=ICP-Brasil
CN=JOAO DA SILVA:61094730068
OU=AC SOLUTI Multipla v5
emailAddress=email@example.com`);
    expect(certificateInfo.subjectAltName).toContain(`email:email@example.com`);
    expect(certificateInfo.issuer).toEqual(`C=BR
ST=SP
L=SÃ£o Paulo
O=ICP-Brasil
CN=JOAO DA SILVA:61094730068
OU=AC SOLUTI Multipla v5
emailAddress=email@example.com`);

    expect(certificateInfo.serialNumber).toEqual(
      '1A860259E05C8CF076247489312CA7CE1E68797E',
    );
    expect(certificateInfo.validFromDate).toEqual(
      new Date('2025-12-20T01:13:31.000Z'),
    );
    expect(certificateInfo.validToDate).toEqual(
      new Date('2035-12-18T01:13:31.000Z'),
    );
  });

  it('should return left when certificate path is invalid', async () => {
    const result = await repository.read({
      pfxPathOrBase64: 'invalid-path.pfx',
      password: 'password',
    });
    expectIsLeft(result);
  });

  it('should return left when certificate path is undefined', async () => {
    const result = await repository.read({
      password: 'password',
    });

    expectIsLeft(result);
    expect(result.value).toStrictEqual(
      new NFeTsError('Certificate path (pfxPathOrBase64) is required'),
    );
  });

  it('should return left when password is incorrect', async () => {
    const result = await repository.read({
      ...cnpjCertificateRequest,
      password: 'wrong-password',
    });
    expectIsLeft(result);
  });

  it('should handle base64 certificate', async () => {
    const pfxBuffer = fs.readFileSync(validCnpjPfxCertificate);
    const base64 = pfxBuffer.toString('base64');
    const result = await repository.read({
      ...cnpjCertificateRequest,
      pfxPathOrBase64: base64,
    });
    expectIsRight(result);
  });

  it('should handle absolute path', async () => {
    const absolutePath = path.resolve(validCnpjPfxCertificate);
    const result = await repository.read({
      ...cnpjCertificateRequest,
      pfxPathOrBase64: absolutePath,
    });
    expectIsRight(result);
  });

  it('should use cache when reading same certificate twice', async () => {
    const cache = new MemoryCacheAdapter();
    const cachedRepository = new NativeCertificateRepository(
      axios.create(),
      cache,
    );

    const result1 = await cachedRepository.read(cnpjCertificateRequest);
    expectIsRight(result1);

    const result2 = await cachedRepository.read(cnpjCertificateRequest);
    expectIsRight(result2);

    expect(result1.value.certificate.serialNumber).toBe(
      result2.value.certificate.serialNumber,
    );
  });

  it('should sign content with SHA1', async () => {
    const result = await repository.read(cnpjCertificateRequest);
    expectIsRight(result);

    const signResult = await repository.sign(
      'test content',
      result.value,
      SignatureAlgorithm.SHA1,
    );
    expectIsRight(signResult);
    expect(signResult.value).toBeDefined();
    expect(typeof signResult.value).toBe('string');
  });

  it('should sign content with SHA256', async () => {
    const result = await repository.read(cnpjCertificateRequest);
    expectIsRight(result);

    const signResult = await repository.sign(
      'test content',
      result.value,
      SignatureAlgorithm.SHA256,
    );
    expectIsRight(signResult);
    expect(signResult.value).toBeDefined();
    expect(typeof signResult.value).toBe('string');
  });

  it('should return left when signing fails', async () => {
    const result = await repository.read(cnpjCertificateRequest);
    expectIsRight(result);

    const invalidKey = result.value.certificate;
    const signResult = await repository.sign(
      'test content',
      invalidKey as never,
      SignatureAlgorithm.SHA1,
    );
    expectIsLeft(signResult);
  });

  it('should get string certificate from certificate', async () => {
    const result = await repository.read(cnpjCertificateRequest);
    expectIsRight(result);

    const certificateString = repository.getStringCertificate(
      result.value.certificate,
    );
    expect(certificateString).toBeDefined();
    expect(typeof certificateString).toBe('string');
    expect(certificateString.length).toBeGreaterThan(0);
  });

  it('should throw error when getting certificate fails', () => {
    const invalidCert = {
      raw: {
        toString: (_?: string) => {
          throw new NFeTsError('test');
        },
      },
    } as never;
    expect(() => {
      repository.getStringCertificate(invalidCert);
    }).toThrow(NFeTsError);
  });

  it('should get string private key from certificate', async () => {
    const result = await repository.read(cnpjCertificateRequest);
    expectIsRight(result);

    expectNotNull(result.value.privateKey);
    const privateKey = repository.getStringPrivateKey(result.value.privateKey);
    expect(privateKey).toBeDefined();
    expect(typeof privateKey).toBe('string');
    expect(privateKey.length).toBeGreaterThan(0);
  });

  it('should throw error when getting private key fails', async () => {
    const result = await repository.read(cnpjCertificateRequest);
    expectIsRight(result);

    const invalidKey = {
      export: () => {
        throw new Error('test');
      },
    };
    expect(() => {
      repository.getStringPrivateKey(invalidKey as never);
    }).toThrow(NFeTsError);
  });

  describe('read via publicCertDerBase64 (Windows)', () => {
    if (!ensurePlatform('win32')) return;

    if (process.env.CI) {
      return it.skip('Skipping on CI: needs Windows user certificate store (same constraints as wincrypt integration tests).', () =>
        void 0);
    }

    it('reads the same leaf certificate as PKCS#12 without private key material', async () => {
      const pfxRead = await repository.read(cnpjCertificateRequest);
      expectIsRight(pfxRead);

      const expectedSerial = pfxRead.value.certificate.serialNumber;
      const publicCertDerBase64 =
        pfxRead.value.certificate.raw.toString('base64');

      const derRead = await repository.read({
        password: '',
        publicCertDerBase64,
      });

      expectIsRight(derRead);
      expect(derRead.value.privateKey).toBeUndefined();
      expect(derRead.value.certificate.serialNumber).toBe(expectedSerial);
      expect(derRead.value.certificate.subject).toBe(
        pfxRead.value.certificate.subject,
      );
    });

    it('signs via CryptoAPI when using DER-only read (cert must be in MY store)', async () => {
      const pfxRead = await repository.read(cnpjCertificateRequest);
      expectIsRight(pfxRead);

      const publicCertDerBase64 =
        pfxRead.value.certificate.raw.toString('base64');

      const wincryptRepository = new NativeCertificateRepository(
        axios.create(),
        new MemoryCacheAdapter(),
      );

      const derRead = await wincryptRepository.read({
        password: '',
        publicCertDerBase64,
      });
      expectIsRight(derRead);

      const signResult = await wincryptRepository.sign(
        'test content',
        derRead.value,
        SignatureAlgorithm.SHA1,
      );
      expectIsRight(signResult);
      expect(signResult.value.length).toBeGreaterThan(0);
    });
  });

  describe('remote URL handling', () => {
    it('should handle remote URL certificate fetch', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        data: fs.readFileSync(validCnpjPfxCertificate),
      });

      const mockAxios = {
        get: mockGet,
      };

      const remoteRepository = new NativeCertificateRepository(
        mockAxios as never,
        new MemoryCacheAdapter(),
      );

      const result = await remoteRepository.read({
        pfxPathOrBase64: 'https://example.com/certificate.pfx',
        password,
      });

      expect(mockGet).toHaveBeenCalled();
      expectIsRight(result);
    });

    it('should handle remote URL fetch error', async () => {
      const mockGet = jest.fn().mockRejectedValue(new Error('Network error'));

      const mockAxios = {
        get: mockGet,
      };

      const remoteRepository = new NativeCertificateRepository(
        mockAxios as never,
        new MemoryCacheAdapter(),
      );

      const result = await remoteRepository.read({
        pfxPathOrBase64: 'https://example.com/certificate.pfx',
        password,
      });

      expectIsLeft(result);
      expect(result.value.message).toContain('Network error');
    });
  });
});
