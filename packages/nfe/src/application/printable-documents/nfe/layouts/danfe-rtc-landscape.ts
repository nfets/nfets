import type { Writable } from 'node:stream';

import { mm } from '@nfets/nfe/domain/entities/printable-documents/nfe';

import { DanfeRtcPdfDocument } from './danfe-rtc';

export class DanfeRtcLandscapePdfDocument extends DanfeRtcPdfDocument {
  protected readonly sideCanhotoWidth = mm(22);

  public constructor(stream: Writable) {
    super(stream);
    this.options = { ...this.options, layout: 'landscape' };
  }
}
