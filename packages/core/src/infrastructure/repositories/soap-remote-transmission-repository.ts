import path from 'node:path';
import { constants } from 'node:crypto';
import { Agent as HttpsAgent } from 'node:https';
import { createClientAsync } from 'soap';

import { right } from '@nfets/core/shared/either';
import { leftFromError } from '@nfets/core/shared/left-from-error';

import type { XmlToolkit } from '@nfets/core/domain';
import type { RemoteTransmissionRepository } from '@nfets/core/domain/repositories/remote-transmission-repository';
import type { CertificateRepository } from '@nfets/core/domain/repositories/certificate-repository';
import type { ReadCertificateResponse } from '@nfets/core/domain/entities/certificate/certificate';
import type {
  Client,
  SendTransmissionPayload,
  ExtractReturnType,
} from '@nfets/core/domain/entities/transmission/payload';

export class SoapRemoteTransmissionRepository<C extends Client>
  implements RemoteTransmissionRepository<C>
{
  private declare certificate?: ReadCertificateResponse;

  public constructor(
    private readonly toolkit: XmlToolkit,
    private readonly certificateRepository: CertificateRepository,
  ) {}

  public setCertificate(certificate: ReadCertificateResponse) {
    return (this.certificate = certificate), this;
  }

  protected get httpsAgent(): HttpsAgent {
    const defaultAgentOptions = {
      rejectUnauthorized: false,
      secureOptions: constants.SSL_OP_LEGACY_SERVER_CONNECT,
    };

    if (!this.certificate) return new HttpsAgent({ ...defaultAgentOptions });

    const { ca, password, certificate, privateKey } = this.certificate;
    return new HttpsAgent({
      passphrase: password,
      cert: certificate.toString(),
      ca: ca.map((c) => c.toString()),
      key: this.certificateRepository.getStringPrivateKey(privateKey),
      ...defaultAgentOptions,
    });
  }

  protected get defaultSoapHeaders() {
    return {
      'Content-Type': 'application/soap+xml; charset=utf-8',
    };
  }

  public async send<P extends SendTransmissionPayload<C>>(params: P) {
    try {
      const httpsAgent = this.httpsAgent;

      const client = await createClientAsync(`${params.url}?wsdl`, {
        attributesKey: '$',
        wsdl_options: { httpsAgent },
      });

      params.payload.$ = {
        xmlns: client.wsdl.definitions.$targetNamespace as string,
        ...(params.payload.$ as object | undefined),
      };

      const _xml = await this.toolkit.build(params.payload, {
        headless: true,
        renderOpts: { pretty: false },
        rootName: params.root,
      });

      const node = this.toolkit.getFirstNode(_xml) ?? '',
        directory = path.dirname(params.xsd),
        xsd = params.xsd;

      const validOrLeft = await this.toolkit.validate(node, directory, xsd);
      if (validOrLeft.isLeft()) return validOrLeft;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const [result] = await client[`${params.method}Async`](
        { _xml },
        { httpsAgent },
      );

      return right(result as ExtractReturnType<C, P>);
    } catch (e) {
      return leftFromError(e);
    }
  }
}
