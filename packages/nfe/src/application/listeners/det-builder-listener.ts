import type { INfeXmlBuilder } from 'src/entities/xml-builder/nfe-xml-builder';
import type { Prod } from 'src/entities/nfe/inf-nfe/det/prod';
import type { ICMS } from 'src/entities/nfe/inf-nfe/det/imposto/icms';
import { Decimal } from '@nfets/core';

export interface DetBuilderListener {
  prod(payload: Prod): void;
  icms(payload: ICMS): void;
}

export class DefaultDetBuilderListener implements DetBuilderListener {
  public constructor(private readonly builder: INfeXmlBuilder) {}

  public prod(payload: Prod): void {
    const zero = Decimal.from(0);
    this.builder.increment(({ ICMSTot }) => ({
      ICMSTot: {
        vProd: Decimal.newOrZero(ICMSTot.vProd)
          .add(payload.vProd)
          .toDecimalPlaces(2)
          .toFixed(2),
        vFrete: Decimal.newOrZero(ICMSTot.vFrete)
          .add(payload.vFrete ?? zero)
          .toDecimalPlaces(2)
          .toFixed(2),
        vSeg: Decimal.newOrZero(ICMSTot.vSeg)
          .add(payload.vSeg ?? zero)
          .toDecimalPlaces(2)
          .toFixed(2),
        vDesc: Decimal.newOrZero(ICMSTot.vDesc)
          .add(payload.vDesc ?? zero)
          .toDecimalPlaces(2)
          .toFixed(2),
        vOutro: Decimal.newOrZero(ICMSTot.vOutro)
          .add(payload.vOutro ?? zero)
          .toDecimalPlaces(2)
          .toFixed(2),
      },
    }));
  }

  public icms(_payload: ICMS): void {
    //
  }
}
