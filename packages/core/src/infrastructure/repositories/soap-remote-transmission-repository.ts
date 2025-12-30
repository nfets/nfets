import os from 'node:os';
import { constants } from 'node:crypto';
import { Agent as HttpsAgent } from 'node:https';
import { createClientAsync } from 'soap';
import axios, { type AxiosInstance } from 'axios';

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
import { WinHttpClient } from './winhttp-client';

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
    if (!privateKey) return new HttpsAgent({ ...defaultAgentOptions });

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

  protected getDefaultRequest(): AxiosInstance {
    const instance = axios.create();
    instance.defaults.httpsAgent = this.httpsAgent;
    return instance;
  }

  protected get request(): AxiosInstance {
    if (os.platform() === 'win32') {
      try {
        if (!this.certificate) return this.getDefaultRequest();
        return WinHttpClient.create(this.certificate);
      } catch (error) {
        return this.getDefaultRequest();
      }
    }

    return this.getDefaultRequest();
  }

  public async send<P extends SendTransmissionPayload<C>>(params: P) {
    try {
      const request = this.request;
      const client = await createClientAsync(`${params.url}?wsdl`, {
        request,
        attributesKey: '$',
        wsdl_options: { request },
        forceSoap12Headers: true,
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
        xsd = params.xsd;

      const validOrLeft = await this.toolkit.validate(node, xsd);
      if (validOrLeft.isLeft()) return validOrLeft;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const [result] = await client[`${params.method}Async`](
        { _xml },
        { request },
      );

      return right(result as ExtractReturnType<C, P>);
    } catch (e) {
      return leftFromError(e);
    }
  }
}
