import type { Writable } from 'node:stream';

import type { Builder } from '@nfets/nfe/domain/entities/printable-documents/builder';

import { Header } from '../builder/header';
import { Totals } from '../builder/totals';
import { Payments } from '../builder/payments';
import { AccessKey } from '../builder/access-key';
import { AggregateQrCodeToProtocols } from '../builder/aggregate-qr-code-to-protocols';
import { Footer } from '../builder/footer';

import { DanfcePdfDocument } from '../danfce';
import { FiscalMessages } from '../builder/fiscal-messages';
import { HomologMessage } from '../builder/homolog-message';

export class DanfceReducedPdfDocument extends DanfcePdfDocument {
  public clone(stream: Writable): DanfcePdfDocument {
    return new DanfceReducedPdfDocument(stream);
  }

  protected get builders(): Builder[] {
    return [
      Header.instance(this),
      FiscalMessages.instance(this),
      HomologMessage.instance(this),
      Totals.instance(this),
      Payments.instance(this),
      AccessKey.instance(this),
      AggregateQrCodeToProtocols.instance(this),
      Footer.instance(this),
    ];
  }
}
