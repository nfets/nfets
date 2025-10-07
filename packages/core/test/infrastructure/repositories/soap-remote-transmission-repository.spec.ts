import { expectIsRight } from '@nfets/test/expects';
import axios from 'axios';

import { Xml2JsToolkit } from '@nfets/core/infrastructure/xml/xml2js-toolkit';
import { MemoryCacheAdapter } from '@nfets/core/infrastructure/repositories/memory-cache-adapter';
import { NativeCertificateRepository } from '@nfets/core/infrastructure/repositories/native-certificate-repository';
import { SoapRemoteTransmissionRepository } from '@nfets/core/infrastructure/repositories/soap-remote-transmission-repository';

import { ensureIntegrationTestsHasValidCertificate } from '@nfets/test/ensure-integration-tests';

describe('soap remote transmission nfe (integration) (not destructive)', () => {
  const certificate = ensureIntegrationTestsHasValidCertificate();
  if (certificate === undefined) return;

  const xml = new Xml2JsToolkit();

  const transmission = new SoapRemoteTransmissionRepository(
    new NativeCertificateRepository(axios.create(), new MemoryCacheAdapter()),
  );

  it('should return schema failed when payload is invalid', async () => {
    await transmission.setCertificate(
      certificate.certificatePath,
      certificate.password,
    );

    const nfeDadosMsg = await xml.build({
      consStatServ: {
        $: { xmlns: 'http://www.portalfiscal.inf.br/nfe', versao: '4.00' },
        someInvalidTag: 'xD',
      },
    });

    const response = await transmission.send({
      payload: { nfeDadosMsg },
      method: 'nfeStatusServicoNFAsync',
      url: 'https://nfe-homologacao.sefazrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx',
    });

    expectIsRight(response);
    expect(response.value).toMatchObject({
      retConsStatServ: {
        cStat: '215',
        xMotivo: 'Rejeicao: Falha no schema XML',
      },
    });
  });
});
