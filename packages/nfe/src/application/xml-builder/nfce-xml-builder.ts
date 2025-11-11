import type {
  IdeBuilder,
  INfeXmlBuilder,
  InfNFeBuilder,
} from '@nfets/nfe/domain/entities/xml-builder/nfe-xml-builder';

import { NfeXmlBuilder } from './nfe-xml-builder';
import { NFCe } from '@nfets/nfe/infrastructure/dto/nfe/nfce';

import type { NFCe as INFCe } from '@nfets/nfe/domain/entities/nfe/nfce';
import type { XmlToolkit } from '@nfets/core/domain';
import type { InfNFeSupl as IInfNFeSupl } from '@nfets/nfe/domain/entities/nfe/inf-nfe-supl';

export class NfceXmlBuilder<T extends object = INFCe>
  extends NfeXmlBuilder<T>
  implements INfeXmlBuilder<T>
{
  protected override readonly data = {
    $: { xmlns: 'http://www.portalfiscal.inf.br/nfe' },
    infNFe: {
      total: { ICMSTot: {} },
    },
    infNFeSupl: {} as IInfNFeSupl,
  } as Partial<INFCe>;

  protected override get entity() {
    return NFCe as new () => T;
  }

  public static override create<T extends object = INFCe>(
    builder: XmlToolkit,
  ): InfNFeBuilder<T> & IdeBuilder<T> {
    return new this(builder);
  }

  protected override assertHomologValidations(): boolean {
    if (!super.assertHomologValidations()) return false;

    if (this.data.infNFe?.det[0].prod) {
      this.data.infNFe.det[0].prod.xProd =
        'NOTA FISCAL EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL' as const;
    }

    return true;
  }
}
