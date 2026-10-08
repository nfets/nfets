import {
  mm,
  type DanfeArea,
} from '@nfets/nfe/domain/entities/printable-documents/nfe';
import { defaultCreditsText } from '@nfets/nfe/domain/entities/printable-documents/nfce';

import { DanfeBlock } from './block';

export class Footer extends DanfeBlock {
  protected readonly textSize = 6;

  public height(): number {
    return mm(4);
  }

  protected draw({ x, y, width }: DanfeArea): void {
    const top = y + mm(1);
    const height = this.height() - mm(1);
    const half = width / 2;

    this.fields.text(`Impresso em ${this.format.now()}`, x, top, half, height, {
      size: this.textSize,
    });

    const { credits } = this.context.options;
    if (!credits) return;

    this.builder.font(this.context.defaults.font).fontSize(this.textSize);
    const line = this.builder.currentLineHeight(true);
    this.builder.text(credits, {
      x: x + half,
      y: top,
      width: half,
      height: Math.max(height, line + 0.5),
      align: 'right',
      ellipsis: true,
      link:
        credits === defaultCreditsText
          ? 'https://github.com/nfets/nfets'
          : void 0,
    });
  }
}
