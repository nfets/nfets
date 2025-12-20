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
  getCpfCertificate,
} from '@nfets/test/certificates';
import fs from 'node:fs';
import path from 'node:path';
import { NFeTsError } from '@nfets/core/domain/errors/nfets-error';
import { SignatureAlgorithm } from '@nfets/core/domain/entities/signer/algo';
import { CryptoSignerRepository } from '@nfets/core/infrastructure/repositories/crypto-signer-repository';

describe('node certificate repository (unit)', () => {
  const password = getCertificatePassword(),
    validCnpjPfxCertificate = getCnpjCertificate(),
    validCpfPfxCertificate = getCpfCertificate();

  const repository = new NativeCertificateRepository(
    axios.create(),
    new CryptoSignerRepository(),
    new MemoryCacheAdapter(),
  );

  it('should sucessfully read a valid CNPJ certificate', async () => {
    const result = await repository.read({
      pfxPathOrBase64: validCnpjPfxCertificate,
      password,
    });
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
    const result = await repository.read({
      pfxPathOrBase64: validCpfPfxCertificate,
      password,
    });
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

  it('should return left when password is incorrect', async () => {
    const result = await repository.read({
      pfxPathOrBase64: validCnpjPfxCertificate,
      password: 'wrong-password',
    });
    expectIsLeft(result);
  });

  it('should handle base64 certificate', async () => {
    const pfxBuffer = fs.readFileSync(validCnpjPfxCertificate);
    const base64 = pfxBuffer.toString('base64');
    const result = await repository.read({
      pfxPathOrBase64: base64,
      password,
    });
    expectIsRight(result);
  });

  it('should handle absolute path', async () => {
    const absolutePath = path.resolve(validCnpjPfxCertificate);
    const result = await repository.read({
      pfxPathOrBase64: absolutePath,
      password,
    });
    expectIsRight(result);
  });

  it('should use cache when reading same certificate twice', async () => {
    const cache = new MemoryCacheAdapter();
    const signerRepository = new CryptoSignerRepository();
    const cachedRepository = new NativeCertificateRepository(
      axios.create(),
      signerRepository,
      cache,
    );

    const result1 = await cachedRepository.read({
      pfxPathOrBase64: validCnpjPfxCertificate,
      password,
    });
    expectIsRight(result1);

    const result2 = await cachedRepository.read({
      pfxPathOrBase64: validCnpjPfxCertificate,
      password,
    });
    expectIsRight(result2);

    expect(result1.value.certificate.serialNumber).toBe(
      result2.value.certificate.serialNumber,
    );
  });

  it('should sign content with SHA1', async () => {
    const result = await repository.read({
      pfxPathOrBase64: validCnpjPfxCertificate,
      password,
    });
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
    const result = await repository.read({
      pfxPathOrBase64: validCnpjPfxCertificate,
      password,
    });
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
    const result = await repository.read({
      pfxPathOrBase64: validCnpjPfxCertificate,
      password,
    });
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
    const result = await repository.read({
      pfxPathOrBase64: validCnpjPfxCertificate,
      password,
    });
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
    const result = await repository.read({
      pfxPathOrBase64: validCnpjPfxCertificate,
      password,
    });
    expectIsRight(result);

    expectNotNull(result.value.privateKey);
    const privateKey = repository.getStringPrivateKey(result.value.privateKey);
    expect(privateKey).toBeDefined();
    expect(typeof privateKey).toBe('string');
    expect(privateKey.length).toBeGreaterThan(0);
  });

  it('should throw error when getting private key fails', async () => {
    const result = await repository.read({
      pfxPathOrBase64: validCnpjPfxCertificate,
      password,
    });
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
        new CryptoSignerRepository(),
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
        new CryptoSignerRepository(),
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
