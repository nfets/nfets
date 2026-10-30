import type { Writable } from 'node:stream';

import type { Builder } from '@nfets/nfe/domain/entities/printable-documents/builder';

import { DanfcePdfDocument } from '../../../nfce/danfce';

import { SimplificadoBody } from './body';

export abstract class DanfeSimplificadoDocument extends DanfcePdfDocument {
  public abstract title(): string;
  public abstract showsItems(): boolean;
  public abstract showsRecipientIe(): boolean;
  public abstract showsEpec(): boolean;

  public abstract clone(stream: Writable): DanfeSimplificadoDocument;

  protected get builders(): Builder[] {
    return [SimplificadoBody.instance(this)];
  }
}
