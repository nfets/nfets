import {
  ArrayMaxSize,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type {
  Fat as IFat,
  Dup as IDup,
  Cobr as ICobr,
} from '@nfets/nfe/entities/nfe/inf-nfe/cobr';
import { TransformDecimal } from '@nfets/nfe/application/transform/decimal';
import type { DecimalValue } from '@nfets/core';

export class Fat implements IFat {
  @IsOptional()
  @IsString()
  public nFat?: string;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vOrig?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vDesc?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vLiq?: DecimalValue;
}

export class Dup implements IDup {
  @IsOptional()
  @IsString()
  public nDup?: string;

  @IsOptional()
  @IsString()
  public dVenc?: string;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vDup?: DecimalValue;
}

export class Cobr implements ICobr {
  @IsOptional()
  @ValidateNested()
  @Type(() => Fat)
  public fat?: Fat;

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMaxSize(120)
  @Type(() => Dup)
  public dup?: Dup[];
}
