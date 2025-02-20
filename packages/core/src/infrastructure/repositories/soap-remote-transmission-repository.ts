import { constants } from 'node:crypto';
import { Agent as HttpsAgent, type AgentOptions } from 'node:https';
import { createClientAsync } from 'soap';

import { right } from 'src/shared/either';

import type { RemoteTransmissionRepository } from 'src/domain/repositories/remote-transmission-repository';
import type { CertificateRepository } from 'src/domain/repositories/certificate-repository';
import type { ReadCertificateResponse } from 'src/domain/entities/certificate/certificate';
import type { AxiosRequestConfig } from 'axios';

export class SoapRemoteTransmissionRepository
  implements RemoteTransmissionRepository
{
  private declare certificate?: ReadCertificateResponse;

  public constructor(
    private readonly schemas: string,
    private readonly certificateRepository: CertificateRepository,
  ) {}

  validateSchema(_: string, __: string) {
    return Promise.resolve(right());
  }

  public async setCertificate(pfxPathOrBase64: string, password: string) {
    const certificateOrError = await this.certificateRepository.read(
      pfxPathOrBase64,
      password,
    );

    if (certificateOrError.isRight()) {
      this.certificate = certificateOrError.value;
    }
  }

  private get httpsAgent(): AgentOptions {
    return new HttpsAgent({
      rejectUnauthorized: false,
      ca: this.certificate?.ca,
      key: this.certificate?.privateKey,
      cert: this.certificate?.certificate,
      passphrase: this.certificate?.password,
      secureOptions: constants.SSL_OP_LEGACY_SERVER_CONNECT,
    });
  }

  async send() {
    const httpsAgent = this.httpsAgent;

    const client = await createClientAsync(
      'https://nfe-homologacao.sefazrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx?WSDL',
      { wsdl_options: { httpsAgent } },
    );

    const xmlData = `<consStatServ xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
    <tpAmb>2</tpAmb>
    <cUF>43</cUF>
    <xServ>STATUS</xServ>
    </consStatServ>`;

    client.addSoapHeader({
      'Content-Type': 'application/soap+xml; charset=utf-8',
    });

    const args = { nfeDadosMsg: xmlData };
    const [result] = await client.nfeStatusServicoNFAsync(args, { httpsAgent });

    return Promise.resolve(right(result));
  }
}

declare module 'soap' {
  interface Client {
    nfeStatusServicoNFAsync(
      args: { nfeDadosMsg: string },
      opt?: AxiosRequestConfig,
    ): Promise<unknown[]>;
  }
}
