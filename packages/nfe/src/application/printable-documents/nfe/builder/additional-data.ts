import {
  mm,
  type DanfeArea,
} from '@nfets/nfe/domain/entities/printable-documents/nfe';
import type { DanfePdfDocument } from '../danfe';

import { DanfeBlock } from './block';
import { DanfeQrCode } from './qr-code';

export class AdditionalData extends DanfeBlock {
  protected readonly title = 'DADOS ADICIONAIS';
  protected readonly textSize = 6.5;
  protected readonly minHeight = mm(22);
  protected readonly maxHeight = mm(70);
  protected readonly qrWidth = mm(32);
  protected readonly withQrCode: boolean = false;
  protected readonly qrCode: DanfeQrCode;

  public constructor(context: DanfePdfDocument) {
    super(context);
    this.qrCode = new DanfeQrCode(context);
  }

  public async prepare(): Promise<void> {
    if (this.withQrCode) await this.qrCode.prepare();
  }

  protected get hasQrCode(): boolean {
    return this.withQrCode && !!this.qrCode.content;
  }

  protected widths(): [number, number, number] {
    const width = this.context.contentWidth;
    const qr = this.hasQrCode ? this.qrWidth : 0;
    const complementary = width * 0.66 - qr;
    return [complementary, qr, width - complementary - qr];
  }

  protected lines(): string[] {
    const { infAdic, ide, dest } = this.infNFe;
    const lines: string[] = [];

    const infAdFisco = this.format.sanitize(infAdic?.infAdFisco);
    if (infAdFisco) lines.push(`Inf. Fisco: ${infAdFisco}`);

    const infCpl = this.format.sanitize(infAdic?.infCpl).replace(/;/g, '\n');
    if (infCpl) lines.push(`Inf. Contribuinte: ${infCpl}`);

    for (const obs of this.context.asArray(infAdic?.obsCont))
      lines.push(`${obs.xCampo}: ${obs.xTexto}`);

    if (this.context.status.isContingency && ide.dhCont)
      lines.push(
        `Emitida em contingência em ${this.format.dateTime(ide.dhCont)}. Justificativa: ${ide.xJust ?? ''}`.trim(),
      );

    const xMsg = this.context.protNFe?.infProt.xMsg;
    if (xMsg) lines.push(`Mensagem SEFAZ: ${xMsg}`);

    if (dest?.email) lines.push(`Email do Destinatário: ${dest.email}`);

    return lines;
  }

  protected get text(): string {
    return this.lines().join('\n');
  }

  protected boxHeight(): number {
    const [width] = this.widths();
    const p = this.fields.padding;
    const text = this.fields.measure(this.text, width - 2 * p, {
      size: this.textSize,
    });
    const content = text + this.fields.labelHeight + 3 * p;
    const qr = this.hasQrCode ? this.qrWidth : 0;
    return Math.min(Math.max(content, qr, this.minHeight), this.maxHeight);
  }

  public height(): number {
    return this.fields.titleHeight + this.boxHeight();
  }

  protected draw({ x, y, width }: DanfeArea): void {
    const p = this.fields.padding;
    const top = y + this.fields.title(x, y, width, this.title);
    const height = this.boxHeight();
    const [complementary, qr, fisco] = this.widths();

    this.fields.box(x, top, complementary, height, {
      label: 'INFORMAÇÕES COMPLEMENTARES',
    });
    const textTop = top + p + this.fields.labelHeight + 1;
    this.fields.text(
      this.text,
      x + p,
      textTop,
      complementary - 2 * p,
      top + height - textTop - p,
      { size: this.textSize },
    );

    if (this.hasQrCode) {
      const qx = x + complementary;
      this.fields.box(qx, top, qr, height, { label: 'QR CODE' });
      const size = Math.min(
        qr - 4 * p,
        height - this.fields.labelHeight - 4 * p,
      );
      this.qrCode.draw(
        qx + (qr - size) / 2,
        top + this.fields.labelHeight + 2 * p,
        size,
      );
    }

    this.fields.box(x + complementary + qr, top, fisco, height, {
      label: 'RESERVADO AO FISCO',
    });
  }
}
