import type { Schema } from '@nfets/nfe/domain';
import type { Either } from '@nfets/core/shared';
import type { NFCe, NfceTransmitterOptions } from '@nfets/nfe/domain';
import type {
  IdeBuilder,
  InfNFeBuilder,
  AssembleNfeBuilder,
} from '@nfets/nfe/domain/entities/xml-builder/nfe-xml-builder';
import {
  NFeTsError,
  type SignedEntity,
  type ReadCertificateRequest,
} from '@nfets/core/domain';

import { NfceQrcode } from '../../transmission/nfce-qrcode';
import { left, right } from '@nfets/core/shared';
import { unreachable } from '@nfets/core/shared';
import { leftFromError } from '@nfets/core/shared/left-from-error';
import { NfceXmlBuilder } from '../../xml-builder/nfce-xml-builder';
import { NfeXmlBuilderPipeline } from './nfe-xml-builder-pipeline';
import { NfceRemoteTransmitter } from '../../transmission/nfce-transmitter';

export class NfceXmlBuilderPipeline<
  T extends object,
> extends NfeXmlBuilderPipeline<T> {
  protected readonly nfceQrcode = new NfceQrcode(this.certificates);
  protected readonly transmitter = new NfceRemoteTransmitter(
    this.soap,
    this.nfceQrcode,
  );

  public constructor(
    certificate?: ReadCertificateRequest,
    schema: Schema = 'PL_009_V4',
    protected readonly options?: Pick<NfceTransmitterOptions, 'qrCode'>,
  ) {
    super(certificate, schema);
  }

  protected readonly builder:
    | (InfNFeBuilder<T> & IdeBuilder<T>)
    | AssembleNfeBuilder<T> = NfceXmlBuilder.create<T>(
    this.toolkit,
    undefined,
    this.schema,
  );

  public override async assemble(): Promise<Either<NFeTsError, string>> {
    if (!this.options?.qrCode) return super.assemble();
    if (!this.certificate)
      return left(
        new NFeTsError(
          'Certificate is required to assemble NFCe XML with QR Code',
        ),
      );

    const xmlOrLeft = await super.assemble();
    if (xmlOrLeft.isLeft()) return xmlOrLeft;

    const entityOrLeft = await this.parseSignedNfce(xmlOrLeft.value);
    if (entityOrLeft.isLeft()) return entityOrLeft;

    const infNFeSupl = await this.generateQrCode(
      entityOrLeft.value,
      this.options,
      this.certificate,
    );
    if (infNFeSupl.isLeft()) return infNFeSupl;

    const xmlString = await this.toolkit.build(entityOrLeft.value, {
      rootName: 'NFe',
    });
    const infNFeSuplString = await this.toolkit.build(infNFeSupl.value, {
      rootName: 'infNFeSupl',
    });

    const xmlWithQrCode = this.toolkit.insertBefore(
      xmlString,
      'Signature',
      infNFeSuplString,
    );

    return right(xmlWithQrCode);
  }

  private async generateQrCode(
    NFe: SignedEntity<NFCe>,
    options: Pick<NfceTransmitterOptions, 'qrCode'>,
    certificateRequest: ReadCertificateRequest,
  ) {
    const service = this.transmitter.service({
      cUF: NFe.infNFe.ide.cUF,
      tpAmb: NFe.infNFe.ide.tpAmb,
      service: 'NfeConsultaQR',
    });

    const qrCode = { ...options.qrCode };
    qrCode.version ??= service.version as '200' | '300';

    switch (qrCode.version) {
      case '200':
        return await this.nfceQrcode.execute(NFe, {
          version: qrCode.version,
          urlConsult: this.transmitter.getUrlConsult(NFe),
          urlService: service.url,
          CSC: qrCode.CSC,
          CSCId: qrCode.CSCId,
        });
      case '300': {
        const certificate = await this.certificates.read(certificateRequest);
        if (certificate.isLeft()) return certificate;
        return await this.nfceQrcode.execute(NFe, {
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

  private async parseSignedNfce(xml: string) {
    try {
      const parsed = await this.toolkit.parse<SignedEntity<NFCe>>(xml);
      return right(parsed);
    } catch (e) {
      return leftFromError(e);
    }
  }
}
