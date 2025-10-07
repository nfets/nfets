import { Decimal } from '@nfets/core';

import type { INfeXmlBuilder } from '@nfets/nfe/entities/xml-builder/nfe-xml-builder';
import type { Prod } from '@nfets/nfe/entities/nfe/inf-nfe/det/prod';
import type { ICMS } from '@nfets/nfe/entities/nfe/inf-nfe/det/imposto/icms';

export interface DetBuilderAggregator {
  prod(payload: Prod): void;
  icms(payload: ICMS): void;
}

export class DefaultDetBuilderAggregator implements DetBuilderAggregator {
  public constructor(private readonly builder: INfeXmlBuilder) {}

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

  public icms(_payload: ICMS): void {
    //
  }
}
