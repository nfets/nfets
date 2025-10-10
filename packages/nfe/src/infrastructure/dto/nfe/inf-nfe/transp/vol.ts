import { IsOptional, IsString } from 'class-validator';
import { TransformDecimal } from '@nfets/core/application';
import { Vol as IVol } from '@nfets/nfe/domain/entities/nfe/inf-nfe/transp';

import type { DecimalValue } from '@nfets/core/domain';

export class Vol implements IVol {
  @IsOptional()
  @IsString()
  public qVol?: string;

  @IsOptional()
  @IsString()
  public esp?: string;

  @IsOptional()
  @IsString()
  public marca?: string;

  @IsOptional()
  @IsString()
  public nVol?: string;

  @IsOptional()
  @TransformDecimal({ fixed: 3 })
  public pesoL?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 3 })
  public pesoB?: DecimalValue;
}
