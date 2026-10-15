import type { DanfeBlocks } from '../danfe';

import { DanfePdfDocument } from '../danfe';
import { Canhoto } from '../builder/canhoto';
import { RtcHeader } from '../builder/rtc-header';
import { Recipient, Location } from '../builder/recipient';
import { Invoices } from '../builder/invoices';
import { RtcTotals } from '../builder/rtc-totals';
import { Issqn } from '../builder/issqn';
import { ConditionalTransport } from '../builder/transport';
import { RtcItems } from '../builder/rtc-items';
import { RtcAdditionalData } from '../builder/rtc-additional-data';
import { Footer } from '../builder/footer';

export class DanfeRtcPdfDocument extends DanfePdfDocument {
  protected createBlocks(): DanfeBlocks {
    return {
      canhoto: new Canhoto(this),
      header: new RtcHeader(this),
      firstPage: [
        new Recipient(this),
        new Location(this, 'retirada'),
        new Location(this, 'entrega'),
        new Invoices(this),
        new RtcTotals(this),
        new Issqn(this),
        new ConditionalTransport(this),
      ],
      items: new RtcItems(this),
      lastPage: [new RtcAdditionalData(this)],
      footer: new Footer(this),
    };
  }
}
