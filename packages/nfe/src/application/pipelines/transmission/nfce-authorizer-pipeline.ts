import { NfeAuthorizerPipeline } from './nfe-authorizer-pipeline';
import { NfceRemoteTransmitter } from '../../transmission/nfce-transmitter';

import {
  NFeTsError,
  type ReadCertificateResponse,
  type ReadCertificateRequest,
  type SignedEntity,
} from '@nfets/core/domain';
import { NfceQrcode } from '../../transmission/nfce-qrcode';
import type {
  AutorizacaoPayload,
  NFCe,
  NfceTransmitterOptions,
  PipelineAuthorizerResponse,
} from '@nfets/nfe/domain';
import { unreachable } from '@nfets/core/shared';
import {
  type Left,
  left,
  type Right,
  type Either,
  right,
} from '@nfets/core/shared/either';

export class NfceAuthorizerPipeline extends NfeAuthorizerPipeline {
  protected readonly qrCode = new NfceQrcode(this.certificates);
  protected readonly transmitter = new NfceRemoteTransmitter(
    this.soap,
    this.qrCode,
  );

  public constructor(protected readonly certificate: ReadCertificateRequest) {
    super(certificate);
  }

  declare options: Pick<NfceTransmitterOptions, 'schema' | 'qrCode'>;

  public override async execute<E extends NFCe, T extends E | E[]>(
    payload: AutorizacaoPayload<E, T>,
    options: Pick<NfceTransmitterOptions, 'schema' | 'qrCode'>,
  ): Promise<Either<NFeTsError, PipelineAuthorizerResponse<E, T>>> {
    this.options = options;
    return super.execute(payload, options);
  }

  protected override async signNfe(
    certificate: ReadCertificateResponse,
    NFe: NFCe,
  ) {
    const signedOrLeft = await super.signNfe(certificate, NFe);
    if (signedOrLeft.isLeft()) return signedOrLeft;
    return this.attachInfNfeSupl(signedOrLeft.value);
  }

  private async attachInfNfeSupl<
    T extends SignedEntity<NFCe> | SignedEntity<NFCe>[],
  >(NFe: T) {
    if (!Array.isArray(NFe)) {
      return this.attachQrCode(NFe) as Promise<Either<NFeTsError, T>>;
    }

    const batch = await Promise.all(NFe.map((NFe) => this.attachQrCode(NFe)));

    if (batch.some((it): it is Left<NFeTsError> => it.isLeft())) {
      return left(new NFeTsError('Failed to attach QRCode to NFCe in batch')); // TODO: handle error in array of errors
    }

    return right(
      batch
        .filter((it): it is Right<SignedEntity<NFCe>> => it.isRight())
        .map((it) => it.value) as T,
    );
  }

  private async attachQrCode(NFe: SignedEntity<NFCe>) {
    const qrCodeOrLeft = await this.generateQrCode(NFe);
    if (qrCodeOrLeft.isLeft()) return qrCodeOrLeft;
    NFe.infNFeSupl = qrCodeOrLeft.value;
    return right(NFe);
  }

  private async generateQrCode(NFe: SignedEntity<NFCe>) {
    const service = this.transmitter.service({
      cUF: NFe.infNFe.ide.cUF,
      tpAmb: NFe.infNFe.ide.tpAmb,
      service: 'NfeConsultaQR',
    });

    const { qrCode } = this.options;
    qrCode.version ??= service.version as '200' | '300';

    switch (qrCode.version) {
      case '200':
        return await this.qrCode.execute(NFe, {
          version: qrCode.version,
          urlConsult: this.transmitter.getUrlConsult(NFe),
          urlService: service.url,
          CSC: qrCode.CSC,
          CSCId: qrCode.CSCId,
        });
      case '300': {
        const certificate = await this.certificates.read(this.certificate);
        if (certificate.isLeft()) return certificate;
        return await this.qrCode.execute(NFe, {
          version: qrCode.version,
          certificate: certificate.value,
          urlConsult: this.transmitter.getUrlConsult(NFe),
          urlService: service.url,
        });
      }
      default:
        return unreachable(qrCode.version as never);
    }
  }
}
