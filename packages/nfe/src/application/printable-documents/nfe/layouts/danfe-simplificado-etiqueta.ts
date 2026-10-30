import type { Writable } from 'node:stream';

import { DanfeSimplificadoDocument } from './simplificado/document';

export class DanfeSimplificadoEtiquetaPdfDocument extends DanfeSimplificadoDocument {
  public constructor(stream: Writable) {
    super(stream);
    this.builder.configure({
      info: {
        Author: 'nfets',
        Creator: 'nfets',
        Keywords: 'nfets, nfe, danfe simplificado etiqueta, sefaz',
        Title: 'DANFE SIMPLIFICADO - ETIQUETA',
        Subject: 'DANFE SIMPLIFICADO - ETIQUETA',
      },
    });
  }

  public title(): string {
    return 'DANFE SIMPLIFICADO - ETIQUETA';
  }

  public showsItems(): boolean {
    return false;
  }

  public showsRecipientIe(): boolean {
    return true;
  }

  public showsEpec(): boolean {
    return true;
  }

  public clone(stream: Writable): DanfeSimplificadoEtiquetaPdfDocument {
    return new DanfeSimplificadoEtiquetaPdfDocument(stream);
  }
}
