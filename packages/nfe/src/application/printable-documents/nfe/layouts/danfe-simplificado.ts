import type { Writable } from 'node:stream';

import { DanfeSimplificadoDocument } from './simplificado/document';

export class DanfeSimplificadoPdfDocument extends DanfeSimplificadoDocument {
  public constructor(stream: Writable) {
    super(stream);
    this.builder.configure({
      info: {
        Author: 'nfets',
        Creator: 'nfets',
        Keywords: 'nfets, nfe, danfe simplificado, sefaz',
        Title: 'DANFE Simplificado',
        Subject: 'DANFE Simplificado',
      },
    });
  }

  public title(): string {
    return 'DANFE Simplificado';
  }

  public showsItems(): boolean {
    return true;
  }

  public showsRecipientIe(): boolean {
    return true;
  }

  public showsEpec(): boolean {
    return false;
  }

  public clone(stream: Writable): DanfeSimplificadoPdfDocument {
    return new DanfeSimplificadoPdfDocument(stream);
  }
}
