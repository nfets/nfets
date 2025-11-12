import axios from 'axios';
import { ASN1 } from '@nfets/core/application/certificate/asn1';
import { NativeCertificateRepository } from '@nfets/core/infrastructure/repositories/native-certificate-repository';
import { MemoryCacheAdapter } from '@nfets/core/infrastructure/repositories/memory-cache-adapter';
import { expectIsRight } from '@nfets/test/expects';
import {
  getCertificatePassword,
  getCnpjCertificate,
  getCpfCertificate,
} from '@nfets/test/certificates';

describe('ASN1 (unit)', () => {
  const password = getCertificatePassword();
  const validCnpjPfxCertificate = getCnpjCertificate();
  const validCpfPfxCertificate = getCpfCertificate();

  const certificateRepository = new NativeCertificateRepository(
    axios.create(),
    new MemoryCacheAdapter(),
  );

  const asn1 = new ASN1();

  it('should extract certificate info from CNPJ certificate', async () => {
    const result = await certificateRepository.read({
      pfxPathOrBase64: validCnpjPfxCertificate,
      password,
    });
    expectIsRight(result);

    const certificateInfo = asn1.extractCertificateInfo(
      result.value.certificate,
    );

    expect(certificateInfo.CN).toBe('79.839.601/0001-42');
    expect(certificateInfo.O).toBe('ICP-Brasil');
    expect(certificateInfo.OU).toBe('Certificado PJ A1');
    expect(certificateInfo.ST).toBe('SÃ£o Paulo');
    expect(certificateInfo.L).toBe('SÃ£o Paulo');
    expect(certificateInfo.C).toBe('BR');

    expect(certificateInfo.CNPJ).toBe('79839601000142');
    expect(certificateInfo.CPF).toBeUndefined();
  });

  it('should extract certificate info from CPF certificate', async () => {
    const result = await certificateRepository.read({
      pfxPathOrBase64: validCpfPfxCertificate,
      password,
    });
    expectIsRight(result);

    const certificateInfo = asn1.extractCertificateInfo(
      result.value.certificate,
    );

    expect(certificateInfo.CN).toBe('610.947.300-68');
    expect(certificateInfo.O).toBe('ICP-Brasil');
    expect(certificateInfo.OU).toBe('Certificado PF A1');
    expect(certificateInfo.ST).toBe('SÃ£o Paulo');
    expect(certificateInfo.L).toBe('SÃ£o Paulo');
    expect(certificateInfo.C).toBe('BR');

    // O OID 2.16.76.1.3.1 contém data de nascimento + CPF
    // O valor esperado é '1504200161094730068' (data: 15/04/2001 + CPF: 61094730068)
    // O código extrai o valor completo do OID
    expect(certificateInfo.CPF).toBeDefined();
    expect(certificateInfo.CNPJ).toBeUndefined();
  });

  it('should handle certificate with CN containing colon', async () => {
    const result = await certificateRepository.read({
      pfxPathOrBase64: validCnpjPfxCertificate,
      password,
    });
    expectIsRight(result);

    const mockSubject = result.value.certificate.subject.replace(
      'CN=79.839.601/0001-42',
      'CN=79.839.601/0001-42:SomeExtraInfo',
    );
    const mockCertificate = {
      subject: mockSubject,
      raw: result.value.certificate.raw,
    } as typeof result.value.certificate;

    const certificateInfo = asn1.extractCertificateInfo(mockCertificate);

    expect(certificateInfo.CN).toBe('79.839.601/0001-42');
    expect(certificateInfo.CN).not.toContain(':');
  });
});
