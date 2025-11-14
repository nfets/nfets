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
import type { ContingencyOptions } from '@nfets/nfe/domain/entities/transmission/nfe-remote-client';
import { TpEmis } from '@nfets/nfe/domain';

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
  } as const as INFCe;

  protected override get entity() {
    return NFCe as new () => T;
  }

  public static override create<T extends object = INFCe>(
    builder: XmlToolkit,
    contingency?: ContingencyOptions,
  ): InfNFeBuilder<T> & IdeBuilder<T> {
    return new this(builder, contingency);
  }

  protected override assertHomologValidations(): boolean {
    if (!super.assertHomologValidations()) return false;

    this.data.infNFe.det[0].prod.xProd =
      'NOTA FISCAL EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL' as const;

    return true;
  }

  protected override assertContingencyModes(): void {
    if (this.contingency === void 0) {
      return this.automaticallyInferContingencyMode();
    }

    this.data.infNFe.ide.dhCont ??= this.contingency.dhCont;
    this.data.infNFe.ide.xJust ??= this.contingency.xJust;

    const { tpEmis } = this.data.infNFe.ide;
    if (tpEmis !== TpEmis.Normal) return;

    return (this.data.infNFe.ide.tpEmis = TpEmis.OFFLINE), void 0;
  }
}
