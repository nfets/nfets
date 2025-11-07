import axios from 'axios';
import { MemoryCacheAdapter } from '@nfets/core/infrastructure/repositories/memory-cache-adapter';
import { NativeCertificateRepository } from '@nfets/core/infrastructure/repositories/native-certificate-repository';
import { expectIsRight, expectIsLeft } from '@nfets/test/expects';
import {
  getCertificatePassword,
  getCnpjCertificate,
  getCpfCertificate,
} from '@nfets/test/certificates';
import fs from 'node:fs';
import path from 'node:path';
import { NFeTsError } from '@nfets/core/domain/errors/nfets-error';
import { SignatureAlgorithm } from '@nfets/core/domain/entities/signer/algo';

describe('node certificate repository (unit)', () => {
  const password = getCertificatePassword(),
    validCnpjPfxCertificate = getCnpjCertificate(),
    validCpfPfxCertificate = getCpfCertificate();

  const repository = new NativeCertificateRepository(
    axios.create(),
    new MemoryCacheAdapter(),
  );

  it('should sucessfully read a valid CNPJ certificate', async () => {
    const result = await repository.read(validCnpjPfxCertificate, password);
    expectIsRight(result);

    const { certificate: certificateInfo } = result.value;

    expect(certificateInfo.subject).toEqual(`C=BR
ST=SÃ£o Paulo
L=SÃ£o Paulo
O=ICP-Brasil
OU=Certificado PJ A1
CN=79.839.601/0001-42
emailAddress=email@example.com`);
    expect(certificateInfo.subjectAltName).toContain(`email:email@example.com`);
    expect(certificateInfo.issuer).toEqual(`C=BR
ST=SÃ£o Paulo
L=SÃ£o Paulo
O=ICP-Brasil
OU=Certificado PJ A1
CN=79.839.601/0001-42
emailAddress=email@example.com`);

    expect(certificateInfo.serialNumber).toEqual(
      '41CCFE9C1EEAC1B02664CF77AAE42F6E64A117B4',
    );
    expect(certificateInfo.validFromDate).toEqual(
      new Date('2025-11-06T16:02:26.000Z'),
    );
    expect(certificateInfo.validToDate).toEqual(
      new Date('2035-11-04T16:02:26.000Z'),
    );
  });

  it('should sucessfully read a valid CPF certificate', async () => {
    const result = await repository.read(validCpfPfxCertificate, password);
    expectIsRight(result);

    const { certificate: certificateInfo } = result.value;

    expect(certificateInfo.subject).toEqual(`C=BR
ST=SÃ£o Paulo
L=SÃ£o Paulo
O=ICP-Brasil
OU=Certificado PF A1
CN=610.947.300-68
emailAddress=email@example.com`);
    expect(certificateInfo.subjectAltName).toContain(`email:email@example.com`);
    expect(certificateInfo.issuer).toEqual(`C=BR
ST=SÃ£o Paulo
L=SÃ£o Paulo
O=ICP-Brasil
OU=Certificado PF A1
CN=610.947.300-68
emailAddress=email@example.com`);

    expect(certificateInfo.serialNumber).toEqual(
      '29914D22ADF9A65E8B24AC2B3673F5FFE2C9678A',
    );
    expect(certificateInfo.validFromDate).toEqual(
      new Date('2025-11-06T16:02:33.000Z'),
    );
    expect(certificateInfo.validToDate).toEqual(
      new Date('2035-11-04T16:02:33.000Z'),
    );
  });

  it('should return left when certificate path is invalid', async () => {
    const result = await repository.read('invalid-path.pfx', 'password');
    expectIsLeft(result);
  });

  it('should return left when password is incorrect', async () => {
    const result = await repository.read(
      validCnpjPfxCertificate,
      'wrong-password',
    );
    expectIsLeft(result);
  });

  it('should handle base64 certificate', async () => {
    const pfxBuffer = fs.readFileSync(validCnpjPfxCertificate);
    const base64 = pfxBuffer.toString('base64');
    const result = await repository.read(base64, password);
    expectIsRight(result);
  });

  it('should handle absolute path', async () => {
    const absolutePath = path.resolve(validCnpjPfxCertificate);
    const result = await repository.read(absolutePath, password);
    expectIsRight(result);
  });

  it('should use cache when reading same certificate twice', async () => {
    const cache = new MemoryCacheAdapter();
    const cachedRepository = new NativeCertificateRepository(
      axios.create(),
      cache,
    );

    const result1 = await cachedRepository.read(
      validCnpjPfxCertificate,
      password,
    );
    expectIsRight(result1);

    const result2 = await cachedRepository.read(
      validCnpjPfxCertificate,
      password,
    );
    expectIsRight(result2);

    expect(result1.value.certificate.serialNumber).toBe(
      result2.value.certificate.serialNumber,
    );
  });

  it('should sign content with SHA1', async () => {
    const result = await repository.read(validCnpjPfxCertificate, password);
    expectIsRight(result);

    const signResult = await repository.sign(
      'test content',
      result.value.privateKey,
      SignatureAlgorithm.SHA1,
    );
    expectIsRight(signResult);
    expect(signResult.value).toBeDefined();
    expect(typeof signResult.value).toBe('string');
  });

  it('should sign content with SHA256', async () => {
    const result = await repository.read(validCnpjPfxCertificate, password);
    expectIsRight(result);

    const signResult = await repository.sign(
      'test content',
      result.value.privateKey,
      SignatureAlgorithm.SHA256,
    );
    expectIsRight(signResult);
    expect(signResult.value).toBeDefined();
    expect(typeof signResult.value).toBe('string');
  });

  it('should return left when signing fails', async () => {
    const result = await repository.read(validCnpjPfxCertificate, password);
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
    const result = await repository.read(validCnpjPfxCertificate, password);
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
    const result = await repository.read(validCnpjPfxCertificate, password);
    expectIsRight(result);

    const privateKey = repository.getStringPrivateKey(result.value.privateKey);
    expect(privateKey).toBeDefined();
    expect(typeof privateKey).toBe('string');
    expect(privateKey.length).toBeGreaterThan(0);
  });

  it('should throw error when getting private key fails', async () => {
    const result = await repository.read(validCnpjPfxCertificate, password);
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

      const result = await remoteRepository.read(
        'https://example.com/certificate.pfx',
        password,
      );

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

      const result = await remoteRepository.read(
        'https://example.com/certificate.pfx',
        password,
      );

      expectIsLeft(result);
      expect(result.value.message).toContain('Network error');
    });
  });
});
