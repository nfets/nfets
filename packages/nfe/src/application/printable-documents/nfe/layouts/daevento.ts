import type { DaeventoBlocks } from '../daevento';
import { DaeventoPdfDocument } from '../daevento';
import { DaeventoHeader } from '../builder/daevento-header';
import { DaeventoBody } from '../builder/daevento-body';
import { DaeventoFooter } from '../builder/daevento-footer';

export class DaeventoDefaultPdfDocument extends DaeventoPdfDocument {
  protected createBlocks(): DaeventoBlocks {
    return {
      header: new DaeventoHeader(this),
      body: new DaeventoBody(this),
      footer: new DaeventoFooter(this),
    };
  }
}
