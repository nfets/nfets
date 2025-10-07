import axios from 'axios';
import { MemoryCacheAdapter } from '@nfets/core/infrastructure/repositories/memory-cache-adapter';
import { NodeCertificateRepository } from '@nfets/core/infrastructure/repositories/node-certificate-repository';
import { expectIsRight } from '@nfets/test/expects';
import {
  getCertificatePassword,
  getCnpjCertificate,
  getCpfCertificate,
} from '@nfets/test/certificates';

describe('node certificate repository (unit)', () => {
  const password = getCertificatePassword(),
    validCnpjPfxCertificate = getCnpjCertificate(),
    validCpfPfxCertificate = getCpfCertificate();

  const repository = new NodeCertificateRepository(
    axios.create(),
    new MemoryCacheAdapter(),
  );

  it('should sucessfully read a valid CNPJ certificate', async () => {
    const result = await repository.read(validCnpjPfxCertificate, password);
    expectIsRight(result);

    const { certificate } = result.value;
    expect(certificate).toMatchObject({
      serialNumber: '4a543b2792cd38d8c80d1dab57c7b034d0e88d79',
      signatureOid: '1.2.840.113549.1.1.11',
    });

    expect(certificate.validity).toMatchObject({
      notBefore: new Date('2025-02-12T16:45:36.000Z'),
      notAfter: new Date('2035-02-10T16:45:36.000Z'),
    });
  });

  it('should sucessfully read a valid CPF certificate', async () => {
    const result = await repository.read(validCpfPfxCertificate, password);
    expectIsRight(result);

    const { certificate } = result.value;
    expect(certificate).toMatchObject({
      serialNumber: '52a80489f00b125fd5a748c4a23bf5fda558f0cb',
      signatureOid: '1.2.840.113549.1.1.11',
    });

    expect(certificate.validity).toMatchObject({
      notBefore: new Date('2025-02-12T16:37:07.000Z'),
      notAfter: new Date('2035-02-10T16:37:07.000Z'),
    });
  });
});
