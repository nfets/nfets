import {
  mm,
  type DanfeArea,
} from '@nfets/nfe/domain/entities/printable-documents/nfe';

import { DanfeBlock } from './block';

export class Canhoto extends DanfeBlock {
  protected readonly textHeight = mm(10);
  protected readonly signatureHeight = mm(7);
  protected readonly numberWidth = mm(35);
  protected readonly spacing = mm(4);

  public height(): number {
    return this.textHeight + this.signatureHeight + this.spacing;
  }

  protected get receivedText(): string {
    const { emit, dest, ide, total } = this.infNFe;
    const parts = [
      `RECEBEMOS DE ${emit.xNome} OS PRODUTOS E/OU SERVIÇOS CONSTANTES DA NOTA FISCAL ELETRÔNICA INDICADA AO LADO.`,
      `EMISSÃO: ${this.format.date(ide.dhEmi)}`,
      `VALOR TOTAL: R$ ${this.format.currency(total.ICMSTot.vNF)}`,
    ];

    if (dest?.xNome) {
      const ender = dest.enderDest;
      const address = ender
        ? ` - ${[ender.xLgr, ender.nro].filter(Boolean).join(', ')} ${ender.xBairro ?? ''} ${ender.xMun ?? ''}-${ender.UF ?? ''}`
        : '';
      parts.push(`DESTINATÁRIO: ${dest.xNome}${address}`);
    }

    return parts.join(' ');
  }

  protected draw({ x, y, width }: DanfeArea): void {
    const p = this.fields.padding;
    const left = width - this.numberWidth;

    this.fields.rect(x, y, left, this.textHeight);
    this.fields.text(
      this.receivedText,
      x + p,
      y + p,
      left - 2 * p,
      this.textHeight - 2 * p,
      { size: 6.5 },
    );

    this.fields.row(x, y + this.textHeight, left, this.signatureHeight, [
      { label: 'DATA DE RECEBIMENTO', weight: 40 },
      { label: 'IDENTIFICAÇÃO E ASSINATURA DO RECEBEDOR', weight: 125 },
    ]);

    const nx = x + left;
    const height = this.textHeight + this.signatureHeight;
    const { nNF, serie } = this.infNFe.ide;
    this.fields.rect(nx, y, this.numberWidth, height);
    this.fields.text('NF-e', nx, y + mm(2), this.numberWidth, 16, {
      size: 13,
      bold: true,
      align: 'center',
    });
    this.fields.text(
      `Nº. ${this.format.number(nNF)}\nSérie ${this.format.serie(serie)}`,
      nx,
      y + mm(8),
      this.numberWidth,
      height - mm(8),
      { size: 8, bold: true, align: 'center' },
    );

    const line = y + height + this.spacing / 2;
    this.builder
      .save()
      .lineWidth(0.4)
      .dash(3, { space: 2 })
      .moveTo(x, line)
      .lineTo(x + width, line)
      .stroke()
      .undash()
      .restore();
  }
}
