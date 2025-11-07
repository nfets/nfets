import { expectIsLeft, expectIsRight } from '@nfets/test/expects';
import path from 'node:path';
import axios from 'axios';

import { Xml2JsToolkit } from '@nfets/core/infrastructure/xml/xml2js-toolkit';
import { MemoryCacheAdapter } from '@nfets/core/infrastructure/repositories/memory-cache-adapter';
import { NativeCertificateRepository } from '@nfets/core/infrastructure/repositories/native-certificate-repository';
import { SoapRemoteTransmissionRepository } from '@nfets/core/infrastructure/repositories/soap-remote-transmission-repository';

import { ensureIntegrationTestsHasValidCertificate } from '@nfets/test/ensure-integration-tests';

import type { Client, CertificateRepository } from '@nfets/core/domain';
import { NFeTsError } from '@nfets/core/domain/errors/nfets-error';

describe('soap remote transmission nfe (integration) (not destructive)', () => {
  const certificateFromEnvironment =
    ensureIntegrationTestsHasValidCertificate();
  if (certificateFromEnvironment === undefined) return;

  const toolkit = new Xml2JsToolkit();

  type TestClient = Client & {
    nfeStatusServicoNF(args: { consStatServ: unknown }): Promise<{
      retConsStatServ: {
        cStat: string;
        xMotivo: string;
      };
    }>;
  };

  class TestSoapRemoteTransmissionRepository extends SoapRemoteTransmissionRepository<TestClient> {}

  let transmission: TestSoapRemoteTransmissionRepository;
  let repository: CertificateRepository;

  beforeAll(async () => {
    repository = new NativeCertificateRepository(
      axios.create(),
      new MemoryCacheAdapter(),
    );
    transmission = new TestSoapRemoteTransmissionRepository(
      toolkit,
      repository,
    );

    const result = await repository.read(
      certificateFromEnvironment.certificatePath,
      certificateFromEnvironment.password,
    );

    if (result.isRight()) {
      transmission.setCertificate(result.value);
    }
  });

  describe('without certificate', () => {
    it('should create https agent without certificate', () => {
      const transmissionWithoutCert = new TestSoapRemoteTransmissionRepository(
        toolkit,
        repository,
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const agent = (transmissionWithoutCert as any).httpsAgent;
      expect(agent).toBeDefined();
    });
  });

  it('should not return schema failed when payload is invalid, due the xsd validation', async () => {
    const response = await transmission.send({
      root: 'nfeDadosMsg',
      xsd: path.resolve(
        __dirname,
        '../../../../nfe/schemas/PL_009_V4',
        'consStatServ_v4.00.xsd',
      ),
      payload: {
        consStatServ: {
          $: { xmlns: 'http://www.portalfiscal.inf.br/nfe', versao: '4.00' },
          someInvalidTag: 'xD',
        },
      },
      method: 'nfeStatusServicoNF',
      url: 'https://nfe-homologacao.sefazrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx',
    });

    expectIsLeft(response);
    expect(response.value).toStrictEqual(
      new NFeTsError(
        `Invalid xml schema: Element '{http://www.portalfiscal.inf.br/nfe}someInvalidTag': This element is not expected. Expected is ( {http://www.portalfiscal.inf.br/nfe}tpAmb ).
`,
      ),
    );
  });

  it('should return rejection result when payload is invalid and valid xml content', async () => {
    const consStatServ = {
      $: { xmlns: 'http://www.portalfiscal.inf.br/nfe', versao: '4.00' },
      tpAmb: '2',
      cUF: '42',
      xServ: 'STATUS',
    };

    const response = await transmission.send({
      root: 'nfeDadosMsg',
      xsd: path.resolve(
        __dirname,
        '../../../../nfe/schemas/PL_009_V4',
        'consStatServ_v4.00.xsd',
      ),
      payload: { consStatServ },
      method: 'nfeStatusServicoNF',
      url: 'https://nfe-homologacao.sefazrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx',
    });

    expectIsRight(response);
    expect(response.value).toMatchObject({
      retConsStatServ: {
        cStat: '410',
        xMotivo:
          'Rejeicao: UF informada no campo cUF nao e atendida pelo Web Service',
      },
    });
  });

  it('should return schema result when payload is valid and valid xml content', async () => {
    const consStatServ = {
      $: { xmlns: 'http://www.portalfiscal.inf.br/nfe', versao: '4.00' },
      tpAmb: '2',
      cUF: '43',
      xServ: 'STATUS',
    };

    const response = await transmission.send({
      root: 'nfeDadosMsg',
      payload: { consStatServ },
      xsd: path.resolve(
        __dirname,
        '../../../../nfe/schemas/PL_009_V4',
        'consStatServ_v4.00.xsd',
      ),
      method: 'nfeStatusServicoNF',
      url: 'https://nfe-homologacao.sefazrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx',
    });

    expectIsRight(response);
    expect(response.value).toMatchObject({
      retConsStatServ: {
        cStat: '107',
        xMotivo: 'Servico em Operacao',
      },
    });
  });
});
