import axios from 'axios';

import type {
  CacheAdapter,
  CertificateRepository,
  HttpClient,
  ReadCertificateRequest,
  RemoteTransmissionRepository,
  XmlToolkit,
} from '@nfets/core/domain';
import {
  Xml2JsToolkit,
  NativeCertificateRepository,
  SoapRemoteTransmissionRepository,
  MemoryCacheAdapter,
} from '@nfets/core/infrastructure';
import {
  EntitySigner,
  ValidateErrorsMetadata,
  XmlSigner,
} from '@nfets/core/application';

import type { NfeRemoteClient } from '@nfets/nfe/domain/entities/transmission/nfe-remote-client';

export abstract class Pipeline {
  protected readonly xmlns = 'http://www.portalfiscal.inf.br/nfe';

  protected readonly http: HttpClient = axios.create();

  protected readonly toolkit: XmlToolkit = new Xml2JsToolkit();

  protected readonly caching: CacheAdapter = new MemoryCacheAdapter();

  protected readonly certificates: CertificateRepository =
    new NativeCertificateRepository(this.http, this.caching);

  protected readonly soap: RemoteTransmissionRepository<NfeRemoteClient> =
    new SoapRemoteTransmissionRepository(this.toolkit, this.certificates);

  protected readonly signer = new EntitySigner(this.toolkit, this.certificates);
  protected readonly xmlSigner = new XmlSigner(this.toolkit, this.certificates);

  public constructor(protected readonly certificate?: ReadCertificateRequest) {}

  protected errors(): string[] | undefined {
    return Reflect.getMetadata(ValidateErrorsMetadata, this) as
      | string[]
      | undefined;
  }
}
