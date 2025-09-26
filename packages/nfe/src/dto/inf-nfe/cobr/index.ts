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
  public nFat?: string;

  @IsOptional()
  @IsString()
  public vOrig?: string;

  @IsOptional()
  @IsString()
  public vDesc?: string;

  @IsOptional()
  @IsString()
  public vLiq?: string;
}

export class Dup implements IDup {
  @IsOptional()
  @IsString()
  public nDup?: string;

  @IsOptional()
  @IsString()
  public dVenc?: string;

  @IsOptional()
  @IsString()
  public vDup?: string;
}

export class Cobr implements ICobr {
  @IsOptional()
  @ValidateNested()
  @Type(() => Fat)
  public fat?: Fat;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Dup)
  public dup?: Dup[];
}
