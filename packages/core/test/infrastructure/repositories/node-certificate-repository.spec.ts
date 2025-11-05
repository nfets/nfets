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
O=EXAMPLE COMPANY LTDA
OU=EXAMPLE COMPANY TI
CN=79.839.601/0001-42
emailAddress=email@example.com`);
    expect(certificateInfo.subjectAltName).toEqual(`email:email@example.com`);
    expect(certificateInfo.issuer).toEqual(`C=BR
ST=SÃ£o Paulo
L=SÃ£o Paulo
O=EXAMPLE COMPANY LTDA
OU=EXAMPLE COMPANY TI
CN=79.839.601/0001-42
emailAddress=email@example.com`);

    expect(certificateInfo.serialNumber).toEqual(
      '4A543B2792CD38D8C80D1DAB57C7B034D0E88D79',
    );
    expect(certificateInfo.validFromDate).toEqual(
      new Date('2025-02-12T16:45:36.000Z'),
    );
    expect(certificateInfo.validToDate).toEqual(
      new Date('2035-02-10T16:45:36.000Z'),
    );
  });

  it('should sucessfully read a valid CPF certificate', async () => {
    const result = await repository.read(validCpfPfxCertificate, password);
    expectIsRight(result);

    const { certificate: certificateInfo } = result.value;

    expect(certificateInfo.subject).toEqual(`C=BR
ST=SÃ£o Paulo
L=SÃ£o Paulo
O=JOÃ\x83O DA SILVA
OU=JOÃ\x83O DA SILVA
CN=610.947.300-68
emailAddress=email@example.com
2.16.76.1.3.3=79839601000142`);
    expect(certificateInfo.subjectAltName).toEqual(`email:email@example.com`);
    expect(certificateInfo.issuer).toEqual(`C=BR
ST=SÃ£o Paulo
L=SÃ£o Paulo
O=JOÃ\x83O DA SILVA
OU=JOÃ\x83O DA SILVA
CN=610.947.300-68
emailAddress=email@example.com
2.16.76.1.3.3=79839601000142`);

    expect(certificateInfo.serialNumber).toEqual(
      '52A80489F00B125FD5A748C4A23BF5FDA558F0CB',
    );
    expect(certificateInfo.validFromDate).toEqual(
      new Date('2025-02-12T16:37:07.000Z'),
    );
    expect(certificateInfo.validToDate).toEqual(
      new Date('2035-02-10T16:37:07.000Z'),
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

  it('should get string public key from certificate', async () => {
    const result = await repository.read(validCnpjPfxCertificate, password);
    expectIsRight(result);

    const publicKey = repository.getStringPublicKey(
      result.value.certificate.publicKey,
    );
    expect(publicKey).toBeDefined();
    expect(typeof publicKey).toBe('string');
    expect(publicKey.length).toBeGreaterThan(0);
  });

  it('should throw error when getting public key fails', () => {
    const invalidCert = {
      export: () => {
        throw new Error('test');
      },
    } as never;
    expect(() => {
      repository.getStringPublicKey(invalidCert);
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
