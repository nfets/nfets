import type { INfeXmlBuilder } from 'src/entities/xml-builder/nfe-xml-builder';
import { Decimal } from '@nfets/core';

export interface TotalBuilderAggregator {
  aggregate(): void;
}

export class DefaultTotalBuilderAggregator implements TotalBuilderAggregator {
  public constructor(private readonly builder: INfeXmlBuilder) {}

  public aggregate(): void {
    const zero = Decimal.from(0);
    this.builder.increment(({ ICMSTot, ISSQNtot }) => ({
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
