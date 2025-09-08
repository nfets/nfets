import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class Fat {
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

export class Dup {
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

export class Cobr {
  @IsOptional()
  @ValidateNested()
  @Type(() => Fat)
  declare fat?: Fat;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Dup)
  declare dup?: Dup[];
}
