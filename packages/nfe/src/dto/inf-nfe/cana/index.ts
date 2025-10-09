import {
  ArrayMaxSize,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type {
  ForDiaAttributes as IForDiaAttributes,
  ForDia as IForDia,
  Cana as ICana,
  Deduc as IDeduc,
} from '@nfets/nfe/entities/nfe/inf-nfe/cana';
import { TransformDecimal } from '@nfets/core/application';
import type { DecimalValue } from '@nfets/core/domain';

export class ForDiaAttributes implements IForDiaAttributes {
  @IsString()
  public dia!: string;
}

export class ForDia implements IForDia {
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => ForDiaAttributes)
  public $!: IForDiaAttributes;

  @IsString()
  public qtde!: DecimalValue;
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

  @ValidateNested({ each: true })
  @ArrayMaxSize(31)
  @Type(() => ForDia)
  public forDia!: [ForDia, ...ForDia[]];

  @IsOptional()
  @IsString()
  public qTotMes?: DecimalValue;

  @IsOptional()
  @IsString()
  public qTotAnt?: DecimalValue;

  @IsOptional()
  @IsString()
  public qTotGer?: DecimalValue;

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
