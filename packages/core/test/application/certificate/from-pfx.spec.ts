import axios from 'axios';
import { ReadCertificateFromPfx } from '@nfets/core/application/certificate/from-pfx';
import { NativeCertificateRepository } from '@nfets/core/infrastructure/repositories/native-certificate-repository';
import { MemoryCacheAdapter } from '@nfets/core/infrastructure/repositories/memory-cache-adapter';
import { expectIsRight, expectIsLeft } from '@nfets/test/expects';
import {
  getCertificatePassword,
  getCnpjCertificate,
} from '@nfets/test/certificates';
import { CryptoSignerRepository } from '@nfets/core/infrastructure/repositories/crypto-signer-repository';

describe('read certificate from pfx (unit)', () => {
  const password = getCertificatePassword();
  const validCnpjPfxCertificate = getCnpjCertificate();
  const signerRepository = new CryptoSignerRepository();

  const certificateRepository = new NativeCertificateRepository(
    axios.create(),
    signerRepository,
    new MemoryCacheAdapter(),
  );

  const readCertificateFromPfx = new ReadCertificateFromPfx(
    certificateRepository,
  );

  it('should successfully read a valid certificate', async () => {
    const result = await readCertificateFromPfx.execute({
      pfxPathOrBase64: validCnpjPfxCertificate,
      password,
    });

    expectIsRight(result);
    expect(result.value.certificate).toBeDefined();
    expect(result.value.privateKey).toBeDefined();
  });

  it('should return left when certificate is invalid', async () => {
    const result = await readCertificateFromPfx.execute({
      pfxPathOrBase64: 'invalid-path',
      password: 'invalid-password',
    });

    expectIsLeft(result);
  });
});
