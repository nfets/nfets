import { plainToInstance } from '@nfets/core';
import type {
  IdeBuilder,
  InfNFeBuilder,
} from '@nfets/nfe/domain/entities/xml-builder/nfe-xml-builder';
import { type DefaultSchema, type Schema, TpEmis } from '@nfets/nfe/domain';

import { NfeXmlBuilder } from './nfe-xml-builder';
import { NFCe } from '@nfets/nfe/infrastructure/dto/nfe/nfce';

import type { NFCe as INFCe } from '@nfets/nfe/domain/entities/nfe/nfce';
import type { XmlToolkit } from '@nfets/core/domain';
import type { ContingencyOptions } from '@nfets/nfe/domain/entities/transmission/nfe-remote-client';

export class NfceXmlBuilder<
  T extends object = INFCe,
  S extends Schema = typeof DefaultSchema,
> extends NfeXmlBuilder<T, S> {
  public override readonly data = {
    $: { xmlns: 'http://www.portalfiscal.inf.br/nfe' },
    infNFe: {
      total: { ICMSTot: {} },
    },
  } as const as INFCe;

  public static override create<
    T extends object = INFCe,
    S extends Schema = typeof DefaultSchema,
  >(
    builder: XmlToolkit,
    contingency?: ContingencyOptions,
    schema: S = 'PL_009_V4' as S,
  ): InfNFeBuilder<T, S> & IdeBuilder<T, S> {
    return new this<T, S>(builder, contingency, schema);
  }

  protected override toInstance(): T {
    return plainToInstance<T>(this.data, NFCe as new () => T, {
      clearEmptyValues: true,
    });
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

    return ((this.data.infNFe.ide.tpEmis = TpEmis.OFFLINE), void 0);
  }
}
