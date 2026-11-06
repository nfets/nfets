import { TpEvent } from '@nfets/nfe/domain/entities/constants/tp-event';
import {
  mm,
  type DanfeArea,
} from '@nfets/nfe/domain/entities/printable-documents/nfe';
import { defaultCreditsText } from '@nfets/nfe/domain/entities/printable-documents/nfce';

import { DaeventoBlock } from './daevento-block';

export class DaeventoFooter extends DaeventoBlock {
  protected readonly disclaimerHeight = mm(14);
  protected readonly creditsHeight = mm(5);

  public height(): number {
    return this.disclaimerHeight + this.creditsHeight;
  }

  protected disclaimer(): string {
    const { tpEvento } = this.context;
    if (tpEvento === TpEvent.CartaCorrecao)
      return (
        'Este documento é uma representação gráfica da CC-e ' +
        'e foi impresso apenas para sua informação e não possui validade ' +
        'fiscal.\nA CC-e deve ser recebida e mantida em arquivo eletrônico XML ' +
        'e pode ser consultada através dos Portais das SEFAZ.'
      );
    return (
      'Este documento é uma representação gráfica do evento de NFe e ' +
      'foi impresso apenas para sua informação e não possui validade ' +
      'fiscal.\nO Evento deve ser recebido e mantido em arquivo ' +
      'eletrônico XML e pode ser consultada através dos Portais ' +
      'das SEFAZ.'
    );
  }

  protected draw({ x, y, width }: DanfeArea): void {
    const topPad = mm(1.5);
    this.fields.text(
      this.disclaimer(),
      x,
      y + topPad,
      width,
      this.disclaimerHeight - topPad,
      { size: 8, align: 'center', lineBreak: true, ellipsis: false },
    );

    const creditsY = y + this.disclaimerHeight;
    this.fields.text(
      `Impresso em ${this.format.now()}`,
      x,
      creditsY,
      width / 2,
      this.creditsHeight,
      { size: 6 },
    );

    const { credits } = this.context.options;
    if (!credits) return;

    this.builder.font(this.context.defaults.font).fontSize(6);
    this.builder.text(credits, {
      x: x + width / 2,
      y: creditsY,
      width: width / 2,
      height: this.creditsHeight,
      align: 'right',
      ellipsis: true,
      link:
        credits === defaultCreditsText
          ? 'https://github.com/nfets/nfets'
          : void 0,
    });
  }
}
