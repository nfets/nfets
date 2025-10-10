import axios from 'axios';
import { MemoryCacheAdapter } from '@nfets/core/infrastructure/repositories/memory-cache-adapter';
import { NativeCertificateRepository } from '@nfets/core/infrastructure/repositories/native-certificate-repository';
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
});
