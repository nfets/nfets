import {
  ArrayMaxSize,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type {
  ForDia as IForDia,
  Cana as ICana,
  Deduc as IDeduc,
} from 'src/entities/nfe/inf-nfe/cana';
import { TransformDecimal } from 'src/application/validator/decimal';
import type { DecimalValue } from '@nfets/core';

export class ForDia implements IForDia {
  @IsString()
  public qtde!: DecimalValue;

  @IsString()
  public dia!: string;
}

export class Deduc implements IDeduc {
  @IsString()
  public xDed!: string;

  @TransformDecimal({ fixed: 2 })
  public vDed!: DecimalValue;
}

export class Cana implements ICana {
  @IsString()
  public safra!: string;

  @IsString()
  public ref!: string;

  @IsOptional()
  @IsString()
  public qTotMes?: DecimalValue;

  @IsOptional()
  @IsString()
  public qTotAnt?: DecimalValue;

  @IsOptional()
  @IsString()
  public qTotGer?: DecimalValue;

  @ValidateNested({ each: true })
  @ArrayMaxSize(31)
  @Type(() => ForDia)
  public forDia!: [ForDia, ...ForDia[]];

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMaxSize(10)
  @Type(() => Deduc)
  public deduc?: Deduc[];

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vFor?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vTotDed?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vLiqFor?: DecimalValue;
}
