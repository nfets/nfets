import { Dif as IDif } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/dif';
import { TransformDecimal } from '@nfets/core/application';
import type { DecimalValue } from '@nfets/core/domain';

export class Dif implements IDif {
  @TransformDecimal({ fixed: 4 })
  public pDif!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vDif!: DecimalValue;
}
