import { Red as IRed } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/red';
import { TransformDecimal } from '@nfets/core/application';
import type { DecimalValue } from '@nfets/core/domain';

export class Red implements IRed {
  @TransformDecimal({ fixed: 4 })
  public pRedAliq!: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public pAliqEfet!: DecimalValue;
}
