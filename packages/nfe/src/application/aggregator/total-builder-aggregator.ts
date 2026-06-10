import { Decimal } from '@nfets/core/infrastructure';
import Schemas from '@nfets/nfe/domain/entities/transmission/schemas';

import type { Det } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det';
import type { ICMS } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/icms';
import type { DeepPartial, UnionToIntersection } from '@nfets/core/shared';
import type { INfeXmlBuilder } from '@nfets/nfe/domain/entities/xml-builder/nfe-xml-builder';

type ICMSItem = UnionToIntersection<NonNullable<ICMS[keyof ICMS]>>;

export interface TotalBuilderAggregator {
  aggregate(): void;
}

export class DefaultTotalBuilderAggregator<T extends object>
  implements TotalBuilderAggregator
{
  public constructor(private readonly builder: INfeXmlBuilder<T>) {}

  public aggregate(): void {
    const zero = Decimal.from(0);
    const isUsingPL_010 = this.builder.schema === Schemas.PL_010_V1_30;

    this.builder.increment(({ ICMSTot, ISSQNtot }, det) => {
      const vICMSDesonDeduz = this.resolveDeductibleVICMSDeson(det);

      return {
        vNFTot: isUsingPL_010
          ? det
              .reduce((acc, item) => acc.add(item?.vItem ?? '0.00'), zero)
              .toFixed(2)
          : void 0,
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
