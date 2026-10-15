import type { Writable } from 'node:stream';

import { DanfeRtcPdfDocument } from './danfe-rtc';

export class DanfeRtcLandscapePdfDocument extends DanfeRtcPdfDocument {
  public constructor(stream: Writable) {
    super(stream);
    this.options = { ...this.options, layout: 'landscape' };
  }
}
