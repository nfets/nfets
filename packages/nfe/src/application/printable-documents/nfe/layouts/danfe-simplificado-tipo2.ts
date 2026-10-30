import type { Writable } from 'node:stream';

import { TpEmis } from '@nfets/nfe/domain';
import type { Builder } from '@nfets/nfe/domain/entities/printable-documents/builder';

import { FiscalMessages } from '../../nfce/builder/fiscal-messages';
import { HomologMessage } from '../../nfce/builder/homolog-message';
import { Items } from '../../nfce/builder/items';
import { Totals } from '../../nfce/builder/totals';
import { Payments } from '../../nfce/builder/payments';
import { AccessKey } from '../../nfce/builder/access-key';
import { DanfcePdfDocument } from '../../nfce/danfce';

import { SimplificadoTipo2Header } from './simplificado-tipo2/header';
import { SimplificadoTipo2QrAggregate } from './simplificado-tipo2/aggregate-qr-code-to-protocols';

export class DanfeSimplificadoTipo2PdfDocument extends DanfcePdfDocument {
  private via?: 'consumidor' | 'estabelecimento';

  public currentCopy() {
    return this.via;
  }

  public constructor(stream: Writable) {
    super(stream);
    this.builder.configure({
      info: {
        Author: 'nfets',
        Creator: 'nfets',
        Keywords: 'nfets, nfe, danfe simplificado tipo 2, sefaz',
        Title: 'DANFE Simplificado Tipo 2',
        Subject: 'DANFE Simplificado Tipo 2',
      },
    });
  }

  public clone(stream: Writable): DanfeSimplificadoTipo2PdfDocument {
    const document = new DanfeSimplificadoTipo2PdfDocument(stream);
    document.via = this.via;
    return document;
  }

  private get isContingency(): boolean {
    return this.data.infNFe.ide.tpEmis !== TpEmis.Normal;
  }

  public async build(xml: string): Promise<this> {
    await this.parse(xml);

    const copies = this.isContingency
      ? (['consumidor', 'estabelecimento'] as const)
      : ([undefined] as const);

    this.via = copies[copies.length - 1];
    this.options.height = await this.getDynamicHeight(
      xml,
      this.clone.bind(this),
    );
    this.apply();

    for (const via of copies) {
      this.via = via;
      this.builder.page();
      for (const builder of this.builders) await builder.build();
    }

    return this;
  }

  protected get builders(): Builder[] {
    return [
      SimplificadoTipo2Header.instance(this),
      FiscalMessages.instance(this),
      HomologMessage.instance(this),
      Items.instance(this),
      Totals.instance(this),
      Payments.instance(this),
      AccessKey.instance(this),
      SimplificadoTipo2QrAggregate.instance(this),
    ];
  }
}
