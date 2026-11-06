import { CancelMark } from '@nfets/nfe/application/printable-documents/nfce/builder/cancel-mark';
import type { DanfcePdfDocument } from '@nfets/nfe/application/printable-documents/nfce/danfce';
import { TpEvent } from '@nfets/nfe/domain/entities/constants/tp-event';

const createContext = (events: DanfcePdfDocument['events'] = []) => {
  const texts: string[] = [];
  const builder = {
    font: jest.fn().mockReturnThis(),
    fontSize: jest.fn().mockReturnThis(),
    widthOfString: jest.fn((text: string) => text.length * 10),
    text: jest.fn((text: string) => {
      texts.push(text);
      return builder;
    }),
    save: jest.fn().mockReturnThis(),
    fillColor: jest.fn().mockReturnThis(),
    restore: jest.fn().mockReturnThis(),
    pageWidth: jest.fn(() => 226.77),
    pageHeight: jest.fn(() => 400),
  };

  return {
    context: {
      builder,
      defaults: { font: 'Helvetica' },
      data: { infNFe: { ide: { cUF: '42' } } },
      events,
    } as unknown as DanfcePdfDocument,
    texts,
  };
};

describe('CancelMark', () => {
  it('should draw nothing when there is no cancellation', () => {
    const { context, texts } = createContext();
    new CancelMark(context).draw();
    expect(texts).toEqual([]);
  });

  it('should draw CANCELADA when retEvento is a cancel protocol', () => {
    const { context, texts } = createContext([
      {
        $: { versao: '1.00' },
        infEvento: {
          tpAmb: '2',
          verAplic: 'SVRS',
          cOrgao: '42',
          cStat: '135',
          xMotivo: 'ok',
          tpEvento: TpEvent.Cancelamento,
          dhRegEvento: '2026-11-05T15:10:00-03:00',
          nProt: '342260000000099',
        },
      },
    ]);

    new CancelMark(context).draw();

    expect(texts).toContain('CANCELADA');
    expect(texts.some((text) => text.includes('342260000000099'))).toBe(true);
  });
});

