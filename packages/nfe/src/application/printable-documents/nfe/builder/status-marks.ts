import { Environment } from '@nfets/core';
import { TpEmis } from '@nfets/nfe/domain';
import { TpEvent } from '@nfets/nfe/domain/entities/constants/tp-event';
import { NfeCstatToProtocol } from '@nfets/nfe/domain/entities/nfe/nfe';
import type { RetEvento } from '@nfets/nfe/domain/entities/services/evento';
import type { DanfePdfDocument } from '../danfe';

export interface DanfeStatus {
  messages: string[];
  detail?: string;
  valid: boolean;
}

export class StatusMarks {
  protected readonly cancelled = ['101', '135', '151', '155'];

  protected readonly denied: string[] = [
    NfeCstatToProtocol.UsoDenegado,
    NfeCstatToProtocol.NfeDenegada,
    NfeCstatToProtocol.DenegadaIrregularidadeEmissor,
    NfeCstatToProtocol.DenegadaIrregularidadeDestinatario,
    NfeCstatToProtocol.DenegadaNaoHabilitadaNaUf,
  ];

  protected readonly invalid = 'SEM VALOR FISCAL';
  protected readonly messageSize = 40;
  protected readonly detailSize = 16;
  protected readonly lineHeight = 1.3;

  public constructor(private readonly context: DanfePdfDocument) {}

  public get isHomolog(): boolean {
    return this.context.data.infNFe.ide.tpAmb !== Environment.Production;
  }

  public get isContingency(): boolean {
    return this.context.data.infNFe.ide.tpEmis !== TpEmis.Normal;
  }

  public get isProtocoled(): boolean {
    return !!this.context.protNFe;
  }

  public get cStat(): string | undefined {
    return this.context.protNFe?.infProt.cStat;
  }

  public get cancellation(): RetEvento['infEvento'] | undefined {
    return this.context.events
      .map((event) => event.infEvento)
      .find(
        (event) =>
          event.tpEvento === TpEvent.Cancelamento &&
          this.cancelled.includes(event.cStat),
      );
  }

  public status(): DanfeStatus {
    if (!this.isProtocoled && this.isContingency)
      return {
        messages: ['EMITIDA EM CONTINGÊNCIA', 'PENDENTE DE AUTORIZAÇÃO'],
        valid: true,
      };
    if (!this.isProtocoled)
      return { messages: ['NFe NÃO PROTOCOLADA'], valid: false };

    const messages: string[] = [];
    if (this.isHomolog) messages.push('NFe EMITIDA EM HOMOLOGAÇÃO');

    const cStat = this.cStat;
    const cancellation = this.cancellation;
    let detail: string | undefined;

    if (cStat && this.denied.includes(cStat)) {
      messages.push('NFe DENEGADA');
      detail = this.context.protNFe?.infProt.xMotivo;
    } else if (cStat && this.cancelled.includes(cStat)) {
      messages.push('NFe CANCELADA');
    } else if (cancellation) {
      messages.push('NFe CANCELADA');
      const date = this.context.format.dateTime(cancellation.dhRegEvento);
      detail = [date, cancellation.nProt].filter(Boolean).join(' - ');
    }

    return { messages, detail, valid: !messages.length };
  }

  protected fit(text: string, size: number, width: number): number {
    this.context.builder.font(this.context.bold).fontSize(size);
    const textWidth = this.context.builder.widthOfString(text);
    return textWidth > width ? (size * width) / textWidth : size;
  }

  public watermark(x: number, y: number, width: number, height: number): void {
    const { messages, detail, valid } = this.status();
    const lines = valid ? messages : [...messages, this.invalid];
    if (!lines.length) return;

    const maxWidth = width * 0.9;
    const sizes = lines.map((line) =>
      this.fit(line, this.messageSize, maxWidth),
    );
    const detailSize = detail ? this.fit(detail, this.detailSize, maxWidth) : 0;
    const total =
      (sizes.reduce((acc, size) => acc + size, 0) + detailSize) *
      this.lineHeight;
    const scale = Math.min(1, height / total);
    const detailIndex = valid ? lines.length : lines.length - 1;

    const { builder, fields } = this.context;
    let top = y + Math.max((height - total * scale) / 2, 0);
    const write = (text: string, size: number) => {
      const lineSize = size * scale;
      fields.text(text, x, top, width, lineSize * this.lineHeight, {
        size: lineSize,
        bold: true,
        align: 'center',
      });
      top += lineSize * this.lineHeight;
    };

    builder.save().fillColor('#000000', 0.3);
    lines.forEach((line, index) => {
      if (detail && index === detailIndex) write(detail, detailSize);
      write(line, sizes[index]);
    });
    if (detail && detailIndex === lines.length) write(detail, detailSize);
    builder.restore().fillColor('black');
  }
}
