import type { NFe } from '@nfets/nfe/infrastructure/dto/nfe/nfe';
import type { ReadCertificateRequest } from '@nfets/core/domain';

import {
  type Either,
  type ReadCertificateResponse,
  type SignedEntity,
  DigestAlgorithm,
  SignatureAlgorithm,
  left,
  right,
  NFeTsError,
  type DeepPartial,
} from '@nfets/core';

import { NfceAuthorizerPipeline } from './nfce-authorizer-pipeline';
import { NfceQrcode } from '../../transmission/nfce-qrcode';
import { NfceRemoteTransmitter } from '../../transmission/nfce-transmitter';

export class NfceContingencyXmlAuthorizerPipeline extends NfceAuthorizerPipeline {
  protected readonly qrCode = new NfceQrcode(this.certificates);
  protected readonly transmitter = new NfceRemoteTransmitter(
    this.soap,
    this.qrCode,
  );

  public constructor(protected readonly certificate: ReadCertificateRequest) {
    super(certificate);
  }

  protected override async handleNfeBatch(
    _certificate: ReadCertificateResponse,
    xml: string | string[],
  ) {
    if (!Array.isArray(xml)) {
      return this.parseContingencyXml(xml).then((result) =>
        result.isLeft() ? result : right([result.value]),
      );
    }

    const batch = await Promise.all(
      xml.map((raw) => this.parseContingencyXml(raw)),
    );

    if (batch.some((it) => it.isLeft())) {
      const error = batch.find((it): it is typeof it & { value: NFeTsError } =>
        it.isLeft(),
      );
      return left(error?.value ?? new NFeTsError('NFC-e XML must be signed'));
    }

    return right(batch.filter((it) => it.isRight()).map((it) => it.value));
  }

  protected async parseContingencyXml(
    xml: string,
  ): Promise<Either<NFeTsError, SignedEntity<NFe>>> {
    const entity = await this.toolkit.parse<SignedEntity<NFe>>(xml);
    return this.assertSignatureIntegrity(entity);
  }

  protected async assertSignatureIntegrity(
    entity: DeepPartial<SignedEntity<NFe>>,
  ): Promise<Either<NFeTsError, SignedEntity<NFe>>> {
    const digestValue = entity.Signature?.SignedInfo?.Reference?.DigestValue;
    if (!digestValue) return left(new NFeTsError('NFC-e XML must be signed'));

    const nodeOrLeft = await this.rebuildInfNFeNode(entity);
    if (nodeOrLeft.isLeft()) return nodeOrLeft;

    const algorithm = this.signatureAlgorithm(entity);
    const computedDigest = this.toolkit.digest(nodeOrLeft.value, algorithm);

    if (computedDigest !== digestValue)
      return left(new NFeTsError('NFC-e XML signature digest mismatch'));

    return right(entity as SignedEntity<NFe>);
  }

  protected async rebuildInfNFeNode(
    entity: DeepPartial<SignedEntity<NFe>>,
  ): Promise<Either<NFeTsError, string>> {
    const xmlns = entity.$?.xmlns;
    const { $: attributes, ...element } = entity.infNFe ?? {};
    delete (attributes as { xmlns?: string }).xmlns;

    const node = await this.toolkit.build(
      {
        $: { xmlns, ...attributes },
        ...element,
      },
      {
        headless: true,
        rootName: 'infNFe',
        renderOpts: { pretty: false },
      },
    );

    return right(node);
  }

  protected signatureAlgorithm(
    entity: DeepPartial<SignedEntity<NFe>>,
  ): SignatureAlgorithm {
    const algorithm =
      entity.Signature?.SignedInfo?.Reference?.DigestMethod?.$?.Algorithm;

    if (algorithm === DigestAlgorithm.SHA256) return SignatureAlgorithm.SHA256;
    return SignatureAlgorithm.SHA1;
  }
}
