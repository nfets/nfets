import { Environment } from '@nfets/core';
import { StatusMarks } from '@nfets/nfe/application/printable-documents/nfe/builder/status-marks';
import type { DanfePdfDocument } from '@nfets/nfe/application/printable-documents/nfe/danfe';

const pageWidth = 841.89;
const pageHeight = 595.28;

const createContext = (layout: 'portrait' | 'landscape'): DanfePdfDocument => {
  const texts: {
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    size: number;
  }[] = [];

  const builder = {
    font: jest.fn().mockReturnThis(),
    fontSize: jest.fn().mockReturnThis(),
    widthOfString: jest.fn((text: string) => text.length * 20),
    save: jest.fn().mockReturnThis(),
    fillColor: jest.fn().mockReturnThis(),
    restore: jest.fn().mockReturnThis(),
    pageWidth: jest.fn(() => pageWidth),
    pageHeight: jest.fn(() => pageHeight),
  };

  const fields = {
    text: jest.fn(
      (
        text: string,
        x: number,
        y: number,
        width: number,
        height: number,
        options?: { size?: number },
      ) => {
        texts.push({
          text,
          x,
          y,
          width,
          height,
          size: options?.size ?? 0,
        });
      },
    ),
  };

  return {
    options: { layout },
    builder,
    fields,
    bold: 'Helvetica-Bold',
    data: { infNFe: { ide: { tpAmb: Environment.Homolog, tpEmis: '1' } } },
    protNFe: { infProt: { cStat: '100' } },
    events: [],
    format: { dateTime: jest.fn() },
    texts,
  } as unknown as DanfePdfDocument & { texts: typeof texts };
};

describe('StatusMarks watermark', () => {
  it.each(['portrait', 'landscape'] as const)(
    'should center the watermark on the sheet in %s',
    (layout) => {
      const context = createContext(layout) as DanfePdfDocument & {
        texts: { x: number; y: number; width: number; size: number }[];
      };
      const status = new StatusMarks(context);

      status.watermark();

      expect(context.builder.pageWidth).toHaveBeenCalled();
      expect(context.builder.pageHeight).toHaveBeenCalled();
      expect(context.texts[0]).toEqual(
        expect.objectContaining({
          x: 0,
          width: pageWidth,
          text: 'NFe EMITIDA EM HOMOLOGAÇÃO',
        }),
      );
      expect(context.texts[0].size).toBe(40);
      expect(context.texts[0].y).toBeGreaterThan(100);
      expect(context.texts[0].y).toBeLessThan(pageHeight / 2);
    },
  );

  it('should not draw when there is nothing to mark', () => {
    const context = createContext('portrait') as DanfePdfDocument & {
      texts: unknown[];
      data: { infNFe: { ide: { tpAmb: string; tpEmis: string } } };
      protNFe: { infProt: { cStat: string } };
    };
    context.data.infNFe.ide.tpAmb = Environment.Production;
    context.protNFe.infProt.cStat = '100';

    new StatusMarks(context).watermark();

    expect(context.texts).toHaveLength(0);
  });
});
