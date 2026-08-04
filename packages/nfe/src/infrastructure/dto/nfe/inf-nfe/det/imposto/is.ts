import { IS as IIS } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/is';
import { TransformDecimal } from '@nfets/core/application';
import type { DecimalValue } from '@nfets/core/domain';
import { IsOptional, IsString } from 'class-validator';

export class IS implements IIS {
  @IsString()
  public CSTIS!: string;

  @IsString()
  public cClassTribIS!: string;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBCIS?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pIS?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public adRemIS?: DecimalValue;

  @IsOptional()
  @IsString()
  public uTrib?: string;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public qTrib?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vIS?: DecimalValue;
}
