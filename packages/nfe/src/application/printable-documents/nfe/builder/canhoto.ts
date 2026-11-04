import {
  mm,
  type DanfeArea,
} from '@nfets/nfe/domain/entities/printable-documents/nfe';

import { DanfeBlock } from './block';

export const canhotoCutGap = mm(4);

export class Canhoto extends DanfeBlock {
  protected readonly minTextHeight = mm(10);
  protected readonly signatureHeight = mm(7);
  protected readonly numberWidth = mm(35);
  protected readonly spacing = canhotoCutGap;
  protected readonly innerPad = mm(1.2);
  protected readonly textSize = 6.5;

  public height(): number {
    return (
      this.textBoxHeight(this.context.contentWidth) +
      this.signatureHeight +
      this.spacing
    );
  }

  protected textBoxHeight(contentWidth: number): number {
    const p = this.innerPad;
    const textWidth = Math.max(contentWidth - this.numberWidth - 2 * p, 1);
    const text = this.receivedText('ABAIXO');
    const measured = this.fields.measure(text, textWidth, {
      size: this.textSize,
    });
    this.builder.fontSize(this.textSize);
    const line = this.builder.currentLineHeight(true);
    return Math.max(this.minTextHeight, measured + 2 * p + line);
  }

  protected receivedText(where: string): string {
    const { emit, dest, ide, total } = this.infNFe;
    const parts = [
      `RECEBEMOS DE ${emit.xNome} OS PRODUTOS E/OU SERVIÇOS CONSTANTES DA NOTA FISCAL ELETRÔNICA INDICADA ${where}.`,
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

  protected draw(area: DanfeArea): void {
    if (area.height) return this.drawSide(area);
    this.drawTop(area);
  }

  protected drawSide({ x, y, width, height = 0 }: DanfeArea): void {
    const nfeHeight = mm(24);
    const textHeight = Math.max(height - nfeHeight, 0);
    this.fields.rect(x, y, width, height);
    this.drawNumber(x, y, width, nfeHeight);
    this.drawRotated(
      [
        this.receivedText('AO LADO'),
        'DATA DE RECEBIMENTO',
        'IDENTIFICAÇÃO E ASSINATURA DO RECEBEDOR',
      ].join(' '),
      x,
      y + nfeHeight,
      width,
      textHeight,
    );
    this.drawCut(
      x + width + this.spacing / 2,
      y,
      x + width + this.spacing / 2,
      y + height,
    );
  }

  protected drawRotated(
    text: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ): void {
    const pad = this.innerPad;
    this.builder
      .save()
      .translate(x, y + height)
      .rotate(-90);
    this.fields.text(text, pad, pad, height - 2 * pad, width - 2 * pad, {
      size: 6,
    });
    this.builder.restore();
  }

  protected drawCut(x1: number, y1: number, x2: number, y2: number): void {
    this.builder
      .save()
      .lineWidth(0.6)
      .dash(4, { space: 3 })
      .moveTo(x1, y1)
      .lineTo(x2, y2)
      .stroke()
      .undash()
      .restore();
  }

  protected drawTop({ x, y, width }: DanfeArea): void {
    const p = this.innerPad;
    const left = width - this.numberWidth;
    const textHeight = this.textBoxHeight(width);
    const text = this.receivedText('ABAIXO');

    this.fields.rect(x, y, left, textHeight);
    this.fields.text(text, x + p, y + p, left - 2 * p, textHeight - 2 * p, {
      size: this.textSize,
      ellipsis: false,
    });

    this.fields.row(x, y + textHeight, left, this.signatureHeight, [
      { label: 'DATA DE RECEBIMENTO', weight: 40 },
      { label: 'IDENTIFICAÇÃO E ASSINATURA DO RECEBEDOR', weight: 125 },
    ]);

    const boxHeight = textHeight + this.signatureHeight;
    this.drawNumber(x + left, y, this.numberWidth, boxHeight);

    const line = y + boxHeight + this.spacing / 2;
    this.drawCut(x, line, x + width, line);
  }

  protected drawNumber(
    x: number,
    y: number,
    width: number,
    height: number,
  ): void {
    const { nNF, serie } = this.infNFe.ide;
    const pad = this.innerPad;
    this.fields.rect(x, y, width, height);
    this.fields.text('NF-e', x + pad, y + mm(2.5), width - 2 * pad, 16, {
      size: 12,
      bold: true,
      align: 'center',
    });
    this.fields.text(
      `Nº. ${this.format.number(nNF)}\nSérie ${this.format.serie(serie)}`,
      x + pad,
      y + mm(8),
      width - 2 * pad,
      height - mm(8) - pad,
      { size: 7, bold: true, align: 'center' },
    );
  }
}
