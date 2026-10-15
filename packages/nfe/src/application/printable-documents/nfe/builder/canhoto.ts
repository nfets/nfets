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

  protected receivedText(atSide = true): string {
    const { emit, dest, ide, total } = this.infNFe;
    const where = atSide ? 'AO LADO' : 'ABAIXO';
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
    this.drawRotated(
      [
        this.receivedText(false),
        'DATA DE RECEBIMENTO',
        'IDENTIFICAÇÃO E ASSINATURA DO RECEBEDOR',
      ].join(' '),
      x,
      y,
      width,
      textHeight,
    );
    this.drawNumber(x, y + textHeight, width, nfeHeight);
  }

  protected drawRotated(
    text: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ): void {
    this.builder
      .save()
      .translate(x, y + height)
      .rotate(-90);
    this.fields.text(text, 0, 1, height, width - 2, { size: 6 });
    this.builder.restore();
  }

  protected drawTop({ x, y, width }: DanfeArea): void {
    const p = this.fields.padding;
    const left = width - this.numberWidth;

    this.fields.rect(x, y, left, this.textHeight);
    this.fields.text(
      this.receivedText(),
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

    const boxHeight = this.textHeight + this.signatureHeight;
    this.drawNumber(x + left, y, this.numberWidth, boxHeight);

    const line = y + boxHeight + this.spacing / 2;
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

  protected drawNumber(
    x: number,
    y: number,
    width: number,
    height: number,
  ): void {
    const { nNF, serie } = this.infNFe.ide;
    this.fields.rect(x, y, width, height);
    this.fields.text('NF-e', x, y + mm(2), width, 16, {
      size: 12,
      bold: true,
      align: 'center',
    });
    this.fields.text(
      `Nº. ${this.format.number(nNF)}\nSérie ${this.format.serie(serie)}`,
      x,
      y + mm(8),
      width,
      height - mm(8),
      { size: 7, bold: true, align: 'center' },
    );
  }
}
