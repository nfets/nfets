import { Decimal } from '@nfets/core/infrastructure';

import type { PIS } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/pis';
import type { Prod } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/prod';
import type { ICMS } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/icms';
import type { COFINS } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/cofins';
import type { INfeXmlBuilder } from '@nfets/nfe/domain/entities/xml-builder/nfe-xml-builder';
import type { UnionToIntersection } from '@nfets/core/shared';

type ICMSIntersection = UnionToIntersection<NonNullable<ICMS[keyof ICMS]>>;

export interface DetBuilderAggregator {
  prod(payload: Prod): void;
  icms(payload: ICMS): void;
  pis(payload: PIS): void;
  cofins(payload: COFINS): void;
}

export class DefaultDetBuilderAggregator<T extends object>
  implements DetBuilderAggregator
{
  public constructor(private readonly builder: INfeXmlBuilder<T>) {}

  public prod(payload: Prod): void {
    const zero = Decimal.from(0);
    this.builder.increment(({ ICMSTot }) => ({
      ICMSTot: {
        vProd: Decimal.newOrZero(ICMSTot?.vProd).add(payload.vProd).toFixed(2),
        vFrete: Decimal.newOrZero(ICMSTot?.vFrete)
          .add(payload.vFrete ?? zero)
          .toFixed(2),
        vSeg: Decimal.newOrZero(ICMSTot?.vSeg)
          .add(payload.vSeg ?? zero)
          .toFixed(2),
        vDesc: Decimal.newOrZero(ICMSTot?.vDesc)
          .add(payload.vDesc ?? zero)
          .toFixed(2),
        vOutro: Decimal.newOrZero(ICMSTot?.vOutro)
          .add(payload.vOutro ?? zero)
          .toFixed(2),
      },
    }));
  }

  public cofins(payload: COFINS): void {
    const zero = Decimal.from(0);
    this.builder.increment(({ ICMSTot }) => ({
      ICMSTot: {
        vCOFINS: Decimal.newOrZero(ICMSTot?.vCOFINS)
          .add(
            payload.COFINSAliq?.vCOFINS ??
              payload.COFINSOutr?.vCOFINS ??
              payload.COFINSQtde?.vCOFINS ??
              zero,
          )
          .toFixed(2),
      },
    }));
  }

  public pis(payload: PIS): void {
    const zero = Decimal.from(0);

    this.builder.increment(({ ICMSTot }) => ({
      ICMSTot: {
        vPIS: Decimal.newOrZero(ICMSTot?.vPIS)
          .add(
            payload.PISAliq?.vPIS ??
              payload.PISOutr?.vPIS ??
              payload.PISQtde?.vPIS ??
              zero,
          )
          .toFixed(2),
      },
    }));
  }

  public icms(payload: ICMS): void {
    const zero = Decimal.from(0);
    const [key] = Object.keys(payload) as (keyof ICMS)[];
    const icms = payload[key] as ICMSIntersection;

    this.builder.increment(({ ICMSTot }) => ({
      ICMSTot: {
        vBC: Decimal.newOrZero(ICMSTot?.vBC)
          .add(icms.vBC ?? zero)
          .toFixed(2),
        vICMS: Decimal.newOrZero(ICMSTot?.vICMS)
          .add(icms.vICMS ?? zero)
          .toFixed(2),
        vICMSDeson: Decimal.newOrZero(ICMSTot?.vICMSDeson)
          .add(icms.vICMSDeson ?? zero)
          .toFixed(2),
        vBCST: Decimal.newOrZero(ICMSTot?.vBCST)
          .add(icms.vBCST ?? zero)
          .toFixed(2),
        vST: Decimal.newOrZero(ICMSTot?.vST)
          .add(icms.vICMSST ?? zero)
          .toFixed(2),
      },
    }));
  }
}
