import {
  UF,
  Environment,
  type CertificateRepository,
  type StateCode,
  NFeTsError,
} from '@nfets/core/domain';
import {
  MemoryCacheAdapter,
  NativeCertificateRepository,
  SoapRemoteTransmissionRepository,
  Xml2JsToolkit,
} from '@nfets/core/infrastructure';
import { NfeRemoteTransmitter } from '@nfets/nfe/application/transmission/nfe-transmitter';
import { type NfeRemoteClient } from '@nfets/nfe/domain/entities/transmission/nfe-remote-client';
import { ensureIntegrationTestsHasValidCertificate } from '@nfets/test/ensure-integration-tests';
import { expectIsLeft, expectIsRight } from '@nfets/test/expects';
import axios from 'axios';

describe('soap nfe remote transmission (integration) (not destructive)', () => {
  const certificateFromEnvironment =
    ensureIntegrationTestsHasValidCertificate();
  if (certificateFromEnvironment === undefined) return;

  const toolkit = new Xml2JsToolkit();

  let transmission: NfeRemoteTransmitter;
  let repository: CertificateRepository;

  beforeAll(async () => {
    repository = new NativeCertificateRepository(
      axios.create(),
      new MemoryCacheAdapter(),
    );

    transmission = new NfeRemoteTransmitter(
      new SoapRemoteTransmissionRepository<NfeRemoteClient>(
        toolkit,
        repository,
      ),
    );

    const result = await repository.read(
      certificateFromEnvironment.certificatePath,
      certificateFromEnvironment.password,
    );

    if (result.isRight()) {
      transmission.configure({
        cUF: UF.RS,
        certificate: result.value,
        tpAmb: Environment.Homolog,
      });
    }
  });

  it('should return left when cUF is invalid', async () => {
    const response = await transmission.consultStatus({
      cUF: '123' as StateCode,
      tpAmb: Environment.Homolog,
    });

    expectIsLeft(response);
    expect(response.value).toStrictEqual(
      new NFeTsError(
        'consultStatus.cUF must be one of the following values: 12, 27, 13, 16, 29, 23, 53, 32, 52, 21, 31, 50, 51, 15, 25, 26, 22, 41, 33, 24, 11, 14, 43, 42, 28, 35, 17',
      ),
    );
  });

  it('it should return "Servico em Operacao" when cStat is "107"', async () => {
    const response = await transmission.consultStatus({
      cUF: UF.RS,
      tpAmb: Environment.Homolog,
    });

    expectIsRight(response);
    expect(response.value.retConsStatServ).toStrictEqual({
      $: { versao: '4.00' },
      tpAmb: '2',
      verAplic: 'RS202401251654',
      cStat: '107',
      xMotivo: 'Servico em Operacao',
      cUF: '43',
      dhRecbto: expect.any(String),
      tMed: '1',
    });
  });
});
