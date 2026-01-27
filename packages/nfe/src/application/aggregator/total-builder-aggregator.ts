import { Decimal } from '@nfets/core/infrastructure';
import Schemas from '@nfets/nfe/domain/entities/transmission/schemas';

import type { INfeXmlBuilder } from '@nfets/nfe/domain/entities/xml-builder/nfe-xml-builder';

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

    this.builder.increment(({ ICMSTot, ISSQNtot }, det) => ({
      vNFTot: isUsingPL_010
        ? det
            .reduce((acc, item) => acc.add(item?.vItem ?? '0.00'), zero)
            .toFixed(2)
        : void 0,
      ICMSTot: {
        vNF: Decimal.newOrZero(ICMSTot?.vProd)
          .sub(ICMSTot?.vDesc ?? zero)
          .sub(ICMSTot?.vICMSDeson ?? zero)
          .add(ICMSTot?.vST ?? zero)
          .add(ICMSTot?.vFCPST ?? zero)
          // .add(ICMSTot?.vICMSMonoReten ?? zero)
          .add(ICMSTot?.vFrete ?? zero)
          .add(ICMSTot?.vSeg ?? zero)
          .add(ICMSTot?.vOutro ?? zero)
          .add(ICMSTot?.vII ?? zero)
          .add(ICMSTot?.vIPI ?? zero)
          .add(ICMSTot?.vIPIDevol ?? zero)
          .add(ISSQNtot?.vServ ?? zero)
          .toFixed(2),
        // .add(ICMSTot?.vPISST ?? zero)
        // .add(ICMSTot?.vCOFINSST ?? zero);
      },
    }));
  }
}
