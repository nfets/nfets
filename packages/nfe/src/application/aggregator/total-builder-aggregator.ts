import { Decimal } from '@nfets/core/infrastructure';

import type { Det } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det';
import type { ICMS } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/icms';
import type { Total as ITotal } from '@nfets/nfe/domain/entities/nfe/inf-nfe/total';
import type { DeepPartial, UnionToIntersection } from '@nfets/core/shared';
import type { Schema } from '@nfets/nfe/domain/entities/transmission/schemas';
import { PL_010 } from '@nfets/nfe/domain/entities/transmission/schemas';

type ICMSItem = UnionToIntersection<NonNullable<ICMS[keyof ICMS]>>;

export interface TotalBuilderAggregator {
  aggregate(): void;
}

export interface TotalIncrementHost {
  readonly schema?: Schema;
  increment(
    callback: (
      context: DeepPartial<ITotal>,
      det: DeepPartial<Det[]>,
    ) => DeepPartial<ITotal>,
  ): unknown;
}

export class DefaultTotalBuilderAggregator implements TotalBuilderAggregator {
  public constructor(private readonly builder: TotalIncrementHost) {}

  public aggregate(): void {
    const zero = Decimal.from(0);
    const isPl010 = (PL_010 as readonly string[]).includes(
      this.builder.schema ?? '',
    );

    this.builder.increment(({ ICMSTot, ISSQNtot }, det) => {
      const vICMSDesonDeduz = this.resolveDeductibleVICMSDeson(det);

      return {
        ...(isPl010
          ? {
              vNFTot: det
                .reduce((acc, item) => acc.add(item?.vItem ?? zero), zero)
                .toFixed(2),
            }
          : {}),
        ICMSTot: {
          vNF: Decimal.newOrZero(ICMSTot?.vProd)
            .sub(ICMSTot?.vDesc ?? zero)
            .sub(vICMSDesonDeduz)
            .add(ICMSTot?.vST ?? zero)
            .add(ICMSTot?.vFCPST ?? zero)
            .add(ICMSTot?.vICMSMonoReten ?? zero)
            .add(ICMSTot?.vFrete ?? zero)
            .add(ICMSTot?.vSeg ?? zero)
            .add(ICMSTot?.vOutro ?? zero)
            .add(ICMSTot?.vII ?? zero)
            .add(ICMSTot?.vIPI ?? zero)
            .add(ICMSTot?.vIPIDevol ?? zero)
            .add(ISSQNtot?.vServ ?? zero)
            .toFixed(2),
        },
      };
    });
  }

  private resolveDeductibleVICMSDeson(det: DeepPartial<Det[]>): string {
    const zero = Decimal.from(0);
    if (!det.length) return zero.toFixed(2);

    return det
      .reduce((acc, item) => {
        const icms = item?.imposto?.ICMS;
        if (!icms) return acc;

        const [key] = Object.keys(icms) as (keyof ICMS)[];
        const icmsItem = icms[key] as ICMSItem | undefined;
        if (icmsItem?.indDeduzDeson !== '1' || icmsItem.vICMSDeson == null) {
          return acc;
        }

        return acc.add(icmsItem.vICMSDeson);
      }, zero)
      .toFixed(2);
  }
}
