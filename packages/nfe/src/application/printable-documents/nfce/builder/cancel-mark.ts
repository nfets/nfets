import { dateToolkit, timezones } from '@nfets/core';
import { TpEvent } from '@nfets/nfe/domain/entities/constants/tp-event';
import type { RetEvento } from '@nfets/nfe/domain/entities/services/evento';
import type { DanfcePdfDocument } from '../danfce';

export class CancelMark {
  protected readonly cancelled = ['101', '135', '151', '155'];
  protected readonly message = 'CANCELADA';
  protected readonly messageSize = 28;
  protected readonly detailSize = 10;
  protected readonly lineHeight = 1.1;

  public constructor(protected readonly context: DanfcePdfDocument) {}

  protected get cancellation(): RetEvento['infEvento'] | undefined {
    return this.context.events
      .map((event) => event.infEvento)
      .find(
        (event) =>
          event.tpEvento === TpEvent.Cancelamento &&
          this.cancelled.includes(event.cStat),
      );
  }

  protected detail(): string | undefined {
    const cancellation = this.cancellation;
    if (!cancellation) return undefined;
    const { cUF } = this.context.data.infNFe.ide;
    const date = dateToolkit(cancellation.dhRegEvento)
      .tz(timezones[cUF])
      .format('DD/MM/YYYY HH:mm:ss');
    return [date, cancellation.nProt].filter(Boolean).join(' - ');
  }

  protected fit(text: string, size: number, width: number): number {
    this.context.builder.font(this.bold).fontSize(size);
    const textWidth = this.context.builder.widthOfString(text);
    return textWidth > width ? (size * width) / textWidth : size;
  }

  protected get bold(): string {
    return `${this.context.defaults.font}-Bold`;
  }

  public draw(): void {
    if (!this.cancellation) return;

    const detail = this.detail();
    const lines = detail ? [this.message, detail] : [this.message];

    const { builder } = this.context;
    const width = builder.pageWidth();
    const height = builder.pageHeight();
    const maxWidth = width * 0.9;
    const sizes = lines.map((line, index) =>
      this.fit(
        line,
        index === 0 ? this.messageSize : this.detailSize,
        maxWidth,
      ),
    );
    const total = sizes.reduce((acc, size) => acc + size, 0) * this.lineHeight;
    const scale = Math.min(1, height / total);
    let top = Math.max((height - total * scale) / 2, 0);

    builder.save().fillColor('#000000', 0.6);
    lines.forEach((line, index) => {
      const size = sizes[index] * scale;
      builder
        .font(this.bold)
        .fontSize(size)
        .text(line, {
          x: 0,
          y: top,
          width,
          height: size * this.lineHeight,
          align: 'center',
          lineBreak: false,
          ellipsis: false,
        });
      top += size * this.lineHeight;
    });
    builder.restore().fillColor('black');
  }
}
