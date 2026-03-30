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
import type { Dest } from '@nfets/nfe/domain/entities/nfe/inf-nfe/dest';
import { TpEmis } from '@nfets/nfe/domain';

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

    if (entity.infNFe.ide.tpEmis !== TpEmis.OFFLINE) {
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

  /** QR Code v3 offline: após vNF vêm tipo (1|2|3 ou vazio)
   * e documento (3–14 dígitos ou vazio), conforme XSD.
   */
  private getQrcodeV300OfflineIdentification(dest: Dest | undefined): {
    tipo: '' | '1' | '2' | '3';
    documento: string;
  } {
    if (!dest) return { tipo: '', documento: '' };

    const { CPF, CNPJ, idEstrangeiro } = dest;
    const digits = CPF
      ? CPF.replace(/\D/g, '')
      : CNPJ
        ? CNPJ.replace(/\D/g, '')
        : idEstrangeiro?.replace(/\D/g, '');

    if (!digits) return { tipo: '', documento: '' };

    if (digits.length === 11) return { tipo: '1', documento: digits };
    if (digits.length === 14) return { tipo: '2', documento: digits };
    if (idEstrangeiro && digits.length >= 3 && digits.length <= 14)
      return { tipo: '3', documento: digits };

    return { tipo: '', documento: '' };
  }

  private emissionDayOfMonthFormatted(dhEmi: string): string {
    return String(new Date(dhEmi).getDate()).padStart(2, '0');
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

    if (entity.infNFe.ide.tpEmis !== TpEmis.OFFLINE)
      return right(`${url}${Id}|${version}|${tpAmb}`);

    const day = this.emissionDayOfMonthFormatted(entity.infNFe.ide.dhEmi),
      value = Number(entity.infNFe.total.ICMSTot.vNF).toFixed(2),
      { tipo, documento } = this.getQrcodeV300OfflineIdentification(
        entity.infNFe.dest,
      );

    const sequence = `${Id}|${version}|${tpAmb}|${day}|${value}|${tipo}|${documento}`;
    const signatureOrLeft = await this.certificateRepository.sign(
      sequence,
      options.certificate,
      SignatureAlgorithm.SHA1,
    );

    if (signatureOrLeft.isLeft()) return signatureOrLeft;
    return right(`${url}${sequence}|${signatureOrLeft.value}`);
  }
}
