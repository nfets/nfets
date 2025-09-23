import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import type {
  Fat as IFat,
  Dup as IDup,
  Cobr as ICobr,
} from 'src/entities/nfe/inf-nfe/cobr';

export class Fat implements IFat {
  @IsOptional()
  @IsString()
  declare nFat?: string;

  @IsOptional()
  @IsString()
  declare vOrig?: string;

  @IsOptional()
  @IsString()
  declare vDesc?: string;

  @IsOptional()
  @IsString()
  declare vLiq?: string;
}

export class Dup implements IDup {
  @IsOptional()
  @IsString()
  declare nDup?: string;

  @IsOptional()
  @IsString()
  declare dVenc?: string;

  @IsOptional()
  @IsString()
  declare vDup?: string;
}

export class Cobr implements ICobr {
  @IsOptional()
  @ValidateNested()
  @Type(() => Fat)
  declare fat?: Fat;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Dup)
  declare dup?: Dup[];
}
