import { TribRegular as ITribRegular } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/trib-regular';
import { TransformDecimal } from '@nfets/core/application';
import type { DecimalValue } from '@nfets/core/domain';
import { IsString } from 'class-validator';

export class TribRegular implements ITribRegular {
  @IsString()
  public CSTReg!: string;

  @IsString()
  public cClassTribReg!: string;

  @TransformDecimal({ fixed: 4 })
  public pAliqEfetRegIBSUF!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vTribRegIBSUF!: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public pAliqEfetRegIBSMun!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vTribRegIBSMun!: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public pAliqEfetRegCBS!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vTribRegCBS!: DecimalValue;
}
