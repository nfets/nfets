import type { DanfeBlocks } from '../danfe';

import { DanfePdfDocument } from '../danfe';
import { Canhoto } from '../builder/canhoto';
import { Header } from '../builder/header';
import { Recipient, Location } from '../builder/recipient';
import { Invoices } from '../builder/invoices';
import { LegacyTaxes } from '../builder/legacy-taxes';
import { Transport } from '../builder/transport';
import { LegacyItems } from '../builder/legacy-items';
import { Issqn } from '../builder/issqn';
import { AdditionalData } from '../builder/additional-data';
import { Footer } from '../builder/footer';

export class DanfeDefaultPdfDocument extends DanfePdfDocument {
  protected createBlocks(): DanfeBlocks {
    return {
      canhoto: new Canhoto(this),
      header: new Header(this),
      firstPage: [
        new Recipient(this),
        new Location(this, 'retirada'),
        new Location(this, 'entrega'),
        new Invoices(this),
        new LegacyTaxes(this),
        new Transport(this),
      ],
      items: new LegacyItems(this),
      lastPage: [new Issqn(this), new AdditionalData(this)],
      footer: new Footer(this),
    };
  }
}
