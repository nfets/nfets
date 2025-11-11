import crypto from 'node:crypto';
import {
  right,
  SignatureAlgorithm,
  unreachable,
  type CertificateRepository,
  type SignedEntity,
} from '@nfets/core';
import type { InfNFeSupl } from '@nfets/nfe/domain/entities/nfe/inf-nfe-supl';
import type {
  NfceQrcodeOptions,
  NfceQrcodeOptions200,
  NfceQrcodeOptions300,
  NfceQrcodeOptionsBase,
} from '@nfets/nfe/domain/entities/transmission/nfce-remote-client';
import type { NFCe as INFCe } from '@nfets/nfe/domain/entities/nfe/nfce';

export class NfceQrcode {
  public constructor(
    private readonly certificateRepository: CertificateRepository,
  ) {}

  public async execute(
    entity: SignedEntity<INFCe>,
    options: NfceQrcodeOptions & NfceQrcodeOptionsBase,
  ) {
    const contentOrLeft = await this.content(entity, options);
    if (contentOrLeft.isLeft()) return contentOrLeft;
    return right(this.assemble(contentOrLeft.value, options));
  }

  private async content(
    entity: SignedEntity<INFCe>,
    options: NfceQrcodeOptions & NfceQrcodeOptionsBase,
  ) {
    if (this.isVersion200(options))
      return await this.execute200(entity, options);

    if (this.isVersion300(options))
      return await this.execute300(entity, options);

    return unreachable(options);
  }

  private isVersion200(
    options: NfceQrcodeOptions,
  ): options is NfceQrcodeOptions200 {
    return options.version === '200';
  }

  private isVersion300(
    options: NfceQrcodeOptions,
  ): options is NfceQrcodeOptions300 {
    return options.version === '300';
  }

  private assemble(qrCode: string, options: NfceQrcodeOptionsBase): InfNFeSupl {
    return { qrCode, urlChave: options.urlConsult } satisfies InfNFeSupl;
  }

  private getSequence(
    entity: SignedEntity<INFCe>,
    options: NfceQrcodeOptions200,
  ) {
    const { version: v, CSCId: _CSCId } = options;
    const tpAmb = entity.infNFe.ide.tpAmb;

    const CSCId = Number.parseInt(_CSCId),
      Id = entity.infNFe.$.Id?.substring(3),
      version = Number.parseInt(v ?? '') / 100;

    if (entity.infNFe.ide.tpEmis !== '9') {
      return `${Id}|${version}|${tpAmb}|${CSCId}`;
    }

    const digest = entity.Signature.SignedInfo.Reference.DigestValue;
    const hex = digest
      .split('')
      .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');

    const day = new Date(entity.infNFe.ide.dhEmi).getDate(),
      value = Number(entity.infNFe.total.ICMSTot.vNF).toFixed(2);

    return `${Id}|${version}|${tpAmb}|${day}|${value}|${hex}|${CSCId}`;
  }

  private async execute200(
    entity: SignedEntity<INFCe>,
    options: NfceQrcodeOptions200 & NfceQrcodeOptionsBase,
  ) {
    const { urlService, CSC } = options;
    const sequence = this.getSequence(entity, options);

    const hash = crypto
      .createHash('sha1')
      .update(`${sequence}${CSC}`)
      .digest('hex')
      .toUpperCase();

    const url = `${urlService}?p=`;
    return Promise.resolve(right(`${url}${sequence}|${hash}`));
  }

  private async execute300(
    entity: INFCe,
    options: NfceQrcodeOptions300 & NfceQrcodeOptionsBase,
  ) {
    const { urlService } = options;

    const url = `${urlService}?p=`;
    const tpAmb = entity.infNFe.ide.tpAmb;

    const Id = entity.infNFe.$.Id?.substring(3),
      version = Number.parseInt(options.version) / 100;

    if (entity.infNFe.ide.tpEmis !== '9') {
      return right(`${url}${Id}|${version}|${tpAmb}`);
    }

    const day = new Date(entity.infNFe.ide.dhEmi).getDate(),
      value = Number(entity.infNFe.total.ICMSTot.vNF).toFixed(2),
      identification =
        entity.infNFe.dest?.CNPJ ??
        entity.infNFe.dest?.CPF ??
        entity.infNFe.dest?.idEstrangeiro ??
        '',
      idDest = identification.length ? entity.infNFe.ide.idDest : '';

    const sequence = `${Id}|${version}|${tpAmb}|${day}|${value}|${idDest}$`;
    const signatureOrLeft = await this.certificateRepository.sign(
      sequence,
      options.certificate.privateKey,
      SignatureAlgorithm.SHA1,
    );

    if (signatureOrLeft.isLeft()) return signatureOrLeft;
    return right(`${url}${sequence}|${signatureOrLeft.value}`);
  }
}
