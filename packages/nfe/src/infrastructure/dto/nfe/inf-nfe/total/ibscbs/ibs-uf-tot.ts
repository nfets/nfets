import { IBSUFTot as IIBSUFTot } from '@nfets/nfe/domain/entities/nfe/inf-nfe/total';
import { TransformDecimal } from '@nfets/core/application';
import type { DecimalValue } from '@nfets/core/domain';

export class IBSUFTot implements IIBSUFTot {
  @TransformDecimal({ fixed: 2 })
  public vDif: DecimalValue = '0.00';

  @TransformDecimal({ fixed: 2 })
  public vDevTrib: DecimalValue = '0.00';

  @TransformDecimal({ fixed: 2 })
  public vIBSUF: DecimalValue = '0.00';
}
