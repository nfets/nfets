import { TpEvent } from '@nfets/nfe/domain/entities/constants/tp-event';
import {
  mm,
  type DanfeArea,
} from '@nfets/nfe/domain/entities/printable-documents/nfe';

import { DaeventoBlock } from './daevento-block';
import type { DaeventoDetEvento } from '../daevento';

export class DaeventoBody extends DaeventoBlock {
  public boxHeight = mm(190);

  public height(): number {
    return this.boxHeight;
  }

  protected title(): string {
    const { tpEvento } = this.context;
    if (tpEvento === TpEvent.CartaCorrecao)
      return 'CORREÇÕES A SEREM CONSIDERADAS';
    if (tpEvento === TpEvent.Cancelamento)
      return 'JUSTIFICATIVA DO CANCELAMENTO';
    return 'DETALHES DO EVENTO';
  }

  protected flat(value: unknown): string {
    if (value == null) return '';
    if (typeof value === 'string' || typeof value === 'number')
      return String(value);
    if (Array.isArray(value))
      return value.map((item) => this.flat(item)).join('; ');
    if (typeof value === 'object') {
      return Object.entries(value as Record<string, unknown>)
        .filter(([key]) => key !== '$')
        .map(([key, item]) => `${key}=${this.flat(item)}`)
        .join(', ');
    }
    return '';
  }

  protected detailLines(det: DaeventoDetEvento): string {
    const skip = new Set([
      'descEvento',
      'xCondUso',
      'xCorrecao',
      'xJust',
      'versao',
      '$',
    ]);
    const lines: string[] = [];
    for (const [key, value] of Object.entries(det)) {
      if (skip.has(key) || value == null) continue;
      if (Array.isArray(value)) {
        lines.push(`${key}:`);
        value.forEach((item, index) => {
          lines.push(`  [${index + 1}] ${this.flat(item)}`);
        });
        continue;
      }
      lines.push(`${key}: ${this.flat(value)}`);
    }
    return lines.join('\n');
  }

  protected content(): string {
    const det = this.context.detEvento;
    if (det.xCorrecao)
      return this.format.sanitize(det.xCorrecao.replace(/;/g, ';\n'));
    if (det.xJust) return this.format.sanitize(det.xJust);

    const details = this.detailLines(det);
    const desc = this.context.descEvento;
    if (details) return `${desc}\n\n${details}`;
    return desc;
  }

  protected draw({ x, y, width }: DanfeArea): void {
    const p = mm(3);
    const titleHeight = mm(5);
    this.fields.text(this.title(), x + p, y, width - 2 * p, titleHeight, {
      size: 9,
      bold: true,
    });

    const boxY = y + titleHeight;
    const boxHeight = Math.max(this.boxHeight - titleHeight, mm(20));
    this.fields.rect(x, boxY, width, boxHeight);
    this.fields.text(
      this.content(),
      x + p,
      boxY + p,
      width - 2 * p,
      boxHeight - 2 * p,
      { size: 11, lineBreak: true, ellipsis: false },
    );
  }
}
