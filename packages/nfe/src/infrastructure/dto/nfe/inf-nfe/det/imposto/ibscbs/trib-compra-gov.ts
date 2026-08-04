import { TribCompraGov as ITribCompraGov } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/trib-compra-gov';
import { TransformDecimal } from '@nfets/core/application';
import type { DecimalValue } from '@nfets/core/domain';

export class TribCompraGov implements ITribCompraGov {
  @TransformDecimal({ fixed: 4 })
  public pAliqIBSUF!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vTribIBSUF!: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public pAliqIBSMun!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vTribIBSMun!: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public pAliqCBS!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vTribCBS!: DecimalValue;
}
