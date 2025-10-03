import { constants } from 'node:crypto';
import { Agent as HttpsAgent, type AgentOptions } from 'node:https';
import { createClientAsync } from 'soap';

import { right } from 'src/shared/either';
import { leftFromError } from 'src/shared/left-from-error';

import type { RemoteTransmissionRepository } from 'src/domain/repositories/remote-transmission-repository';
import type { CertificateRepository } from 'src/domain/repositories/certificate-repository';
import type { ReadCertificateResponse } from 'src/domain/entities/certificate/certificate';
import type { AxiosRequestConfig } from 'axios';
import type { SendTransmissionPayload } from 'src/domain/entities/transmission/payload';

export class SoapRemoteTransmissionRepository
  implements RemoteTransmissionRepository
{
  private declare certificate?: ReadCertificateResponse;

  public constructor(
    private readonly certificateRepository: CertificateRepository,
  ) {}

  public async setCertificate(pfxPathOrBase64: string, password: string) {
    const certificateOrError = await this.certificateRepository.read(
      pfxPathOrBase64,
      password,
    );

    if (certificateOrError.isRight()) {
      this.certificate = certificateOrError.value;
    }
  }

  protected get httpsAgent(): AgentOptions {
    const defaultAgentOptions = {
      rejectUnauthorized: false,
      secureOptions: constants.SSL_OP_LEGACY_SERVER_CONNECT,
    };

    if (!this.certificate) return new HttpsAgent({ ...defaultAgentOptions });
    const { ca, password, certificate, privateKey } = this.certificate;

    const key = this.certificateRepository.getStringPrivateKey(privateKey);
    const cert = this.certificateRepository.getStringPublicKey(certificate);

    return new HttpsAgent({
      key,
      cert,
      ca: ca,
      passphrase: password,
      ...defaultAgentOptions,
    });
  }

  protected get defaultSoapHeaders() {
    return {
      'Content-Type': 'application/soap+xml; charset=utf-8',
    };
  }

  async send<R, M extends string>(params: SendTransmissionPayload<M>) {
    try {
      const httpsAgent = this.httpsAgent;

      const client = await createClientAsync(`${params.url}?wsdl`, {
        wsdl_options: { httpsAgent },
      });

      client.addSoapHeader(this.defaultSoapHeaders);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
      const [result] = await client[params.method](params.payload, {
        httpsAgent,
      });

      return right(result as R);
    } catch (e) {
      return leftFromError(e);
    }
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
