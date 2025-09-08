import {
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class IPITrib {
  @IsDefined()
  @IsString()
  declare CST: string;

  @IsOptional()
  @IsString()
  declare vBC?: string;

  @IsOptional()
  @IsString()
  declare pIPI?: string;

  @IsOptional()
  @IsString()
  declare qUnid?: string;

  @IsOptional()
  @IsString()
  declare vUnid?: string;

  @IsOptional()
  @IsString()
  declare vIPI?: string;
}

export class IPINT {
  @IsDefined()
  @IsString()
  declare CST: string;
}

export class IPI {
  @IsOptional()
  @IsString()
  declare CNPJProd?: string;

  @IsOptional()
  @IsString()
  declare cSelo?: string;

  @IsOptional()
  @IsString()
  declare qSelo?: string;

  @IsDefined()
  @IsString()
  declare cEnq: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => IPITrib)
  declare IPITrib?: IPITrib;

  @IsOptional()
  @ValidateNested()
  @Type(() => IPINT)
  declare IPINT?: IPINT;
}

export class DevolIPI {
  @IsDefined()
  @IsString()
  declare vIPIDevol: string;
}
