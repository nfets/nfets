import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import type { IPITrib as IIPITrib } from 'src/entities/nfe/inf-nfe/det/imposto/ipi';
import type { IPINT as IIPINT } from 'src/entities/nfe/inf-nfe/det/imposto/ipi';
import type { IPI as IIPI } from 'src/entities/nfe/inf-nfe/det/imposto/ipi';

export class IPITrib implements IIPITrib {
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

export class IPINT implements IIPINT {
  @IsString()
  declare CST: string;
}

export class IPI implements IIPI {
  @IsOptional()
  @IsString()
  declare CNPJProd?: string;

  @IsOptional()
  @IsString()
  declare cSelo?: string;

  @IsOptional()
  @IsString()
  declare qSelo?: string;

  @IsString()
  declare cEnq: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => IPITrib)
  declare IPITrib?: IIPITrib;

  @IsOptional()
  @ValidateNested()
  @Type(() => IPINT)
  declare IPINT?: IIPINT;
}
