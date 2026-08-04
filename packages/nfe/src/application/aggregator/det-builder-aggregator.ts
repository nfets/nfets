import { Decimal } from '@nfets/core/infrastructure';

import type { PIS } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/pis';
import type { Prod } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/prod';
import type { ICMS } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/icms';
import type { COFINS } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/cofins';
import type { INfeXmlBuilder } from '@nfets/nfe/domain/entities/xml-builder/nfe-xml-builder';
import type { UnionToIntersection } from '@nfets/core/shared';
import type { ISSQN } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/issqn';
import type { Imposto } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto';
import type { II } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ii';
import type { IPI } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ipi';
import type { Devol } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto-devol';
import type { Schema } from '@nfets/nfe/domain/entities/transmission/schemas';
import type { DecimalValue } from '@nfets/core/domain';

type ICMSIntersection = UnionToIntersection<NonNullable<ICMS[keyof ICMS]>>;

type ICMSExtended = ICMSIntersection & {
  vFCP?: DecimalValue;
  vFCPST?: DecimalValue;
  vFCPSTRet?: DecimalValue;
};

export interface DetBuilderAggregator {
  prod(payload: Prod): void;
  issqn(payload: ISSQN): void;
  icms(payload: ICMS): void;
  pis(payload: PIS): void;
  cofins(payload: COFINS): void;
  imposto(payload: Imposto): void;
  ii(payload: II): void;
  ipi(payload: IPI): void;
  impostoDevol(payload: Devol): void;
}

export class DefaultDetBuilderAggregator<
  T extends object,
  S extends Schema,
> implements DetBuilderAggregator {
  private readonly zero = Decimal.from(0);

  public constructor(private readonly builder: INfeXmlBuilder<T, S>) {}

  public prod(payload: Prod): void {
    this.builder.increment(({ ICMSTot }) => ({
      ICMSTot: {
        vProd: this.sum(ICMSTot?.vProd, payload.vProd),
        vFrete: this.sum(ICMSTot?.vFrete, payload.vFrete),
        vSeg: this.sum(ICMSTot?.vSeg, payload.vSeg),
        vDesc: this.sum(ICMSTot?.vDesc, payload.vDesc),
        vOutro: this.sum(ICMSTot?.vOutro, payload.vOutro),
      },
    }));
  }

  public issqn(payload: ISSQN): void {
    this.builder.increment(({ ISSQNtot }) => ({
      ISSQNtot: {
        vISS: this.sum(ISSQNtot?.vISS, payload.vISSQN),
      },
    }));
  }

  public cofins(payload: COFINS): void {
    this.builder.increment(({ ICMSTot }) => ({
      ICMSTot: {
        vCOFINS: this.sum(
          ICMSTot?.vCOFINS,
          payload.COFINSAliq?.vCOFINS ??
            payload.COFINSOutr?.vCOFINS ??
            payload.COFINSQtde?.vCOFINS,
        ),
      },
    }));
  }

  public pis(payload: PIS): void {
    this.builder.increment(({ ICMSTot }) => ({
      ICMSTot: {
        vPIS: this.sum(
          ICMSTot?.vPIS,
          payload.PISAliq?.vPIS ??
            payload.PISOutr?.vPIS ??
            payload.PISQtde?.vPIS,
        ),
      },
    }));
  }

  public icms(payload: ICMS): void {
    const [key] = Object.keys(payload) as (keyof ICMS)[];
    const icms = payload[key] as ICMSExtended;

    this.builder.increment(({ ICMSTot }) => ({
      ICMSTot: {
        vBC: this.sum(ICMSTot?.vBC, icms.vBC),
        vICMS: this.sum(ICMSTot?.vICMS, icms.vICMS),
        vICMSDeson: this.sum(ICMSTot?.vICMSDeson, icms.vICMSDeson),
        vBCST: this.sum(ICMSTot?.vBCST, icms.vBCST),
        vST: this.sum(ICMSTot?.vST, icms.vICMSST),
        vFCP: this.sum(ICMSTot?.vFCP, icms.vFCP),
        vFCPST: this.sum(ICMSTot?.vFCPST, icms.vFCPST),
        vFCPSTRet: this.sum(ICMSTot?.vFCPSTRet, icms.vFCPSTRet),
        qBCMono: this.sum(ICMSTot?.qBCMono, icms.qBCMono),
        vICMSMono: this.sum(ICMSTot?.vICMSMono, icms.vICMSMono),
        qBCMonoReten: this.sum(ICMSTot?.qBCMonoReten, icms.qBCMonoReten),
        vICMSMonoReten: this.sum(ICMSTot?.vICMSMonoReten, icms.vICMSMonoReten),
        qBCMonoRet: this.sum(ICMSTot?.qBCMonoRet, icms.qBCMonoRet),
        vICMSMonoRet: this.sum(ICMSTot?.vICMSMonoRet, icms.vICMSMonoRet),
      },
    }));
  }

  public imposto(payload: Imposto): void {
    if (payload.vTotTrib == null) return;

    this.builder.increment(({ ICMSTot }) => ({
      ICMSTot: {
        vTotTrib: this.sum(ICMSTot?.vTotTrib, payload.vTotTrib),
      },
    }));
  }

  public ii(payload: II): void {
    this.builder.increment(({ ICMSTot }) => ({
      ICMSTot: {
        vII: this.sum(ICMSTot?.vII, payload.vII),
      },
    }));
  }

  public ipi(payload: IPI): void {
    const vIPI = payload.IPITrib?.vIPI;
    if (!vIPI) return;

    this.builder.increment(({ ICMSTot }) => ({
      ICMSTot: {
        vIPI: this.sum(ICMSTot?.vIPI, vIPI),
      },
    }));
  }

  public impostoDevol(payload: Devol): void {
    const vIPIDevol = payload.IPI?.vIPIDevol;
    if (!vIPIDevol) return;

    this.builder.increment(({ ICMSTot }) => ({
      ICMSTot: {
        vIPIDevol: this.sum(ICMSTot?.vIPIDevol, vIPIDevol),
      },
    }));
  }

  private sum(
    current: DecimalValue | undefined,
    value: DecimalValue | number | undefined,
    fixed = 2,
  ): string {
    return Decimal.newOrZero(current)
      .add(value ?? this.zero)
      .toFixed(fixed);
  }
}
