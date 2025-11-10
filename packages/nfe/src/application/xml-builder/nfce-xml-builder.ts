import type {
  IdeBuilder,
  INfeXmlBuilder,
  InfNFeBuilder,
} from '@nfets/nfe/domain/entities/xml-builder/nfe-xml-builder';

import { NfeXmlBuilder } from './nfe-xml-builder';
import { NFCe } from '@nfets/nfe/infrastructure/dto/nfe/nfce';

import type { NFCe as INFCe } from '@nfets/nfe/domain/entities/nfe/nfce';
import type { XmlToolkit } from '@nfets/core/domain';

export class NfceXmlBuilder<T extends object = INFCe>
  extends NfeXmlBuilder<T>
  implements INfeXmlBuilder<T>
{
  protected override get entity() {
    return NFCe as new () => T;
  }

  public static create<T extends object = INFCe>(
    builder: XmlToolkit,
  ): InfNFeBuilder<T> & IdeBuilder<T> {
    return new this(builder);
  }
}
