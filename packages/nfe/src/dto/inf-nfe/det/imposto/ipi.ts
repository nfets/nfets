import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import type { IPITrib as IIPITrib } from '@nfets/nfe/entities/nfe/inf-nfe/det/imposto/ipi';
import type { IPINT as IIPINT } from '@nfets/nfe/entities/nfe/inf-nfe/det/imposto/ipi';
import type { IPI as IIPI } from '@nfets/nfe/entities/nfe/inf-nfe/det/imposto/ipi';

export class IPITrib implements IIPITrib {
  @IsString()
  public CST!: string;

  @IsOptional()
  @IsString()
  public vBC?: string;

  @IsOptional()
  @IsString()
  public pIPI?: string;

  @IsOptional()
  @IsString()
  public qUnid?: string;

  @IsOptional()
  @IsString()
  public vUnid?: string;

  @IsOptional()
  @IsString()
  public vIPI?: string;
}

export class IPINT implements IIPINT {
  @IsString()
  public CST!: string;
}

export class IPI implements IIPI {
  @IsOptional()
  @IsString()
  public CNPJProd?: string;

  @IsOptional()
  @IsString()
  public cSelo?: string;

  @IsOptional()
  @IsString()
  public qSelo?: string;

  @IsString()
  public cEnq!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => IPITrib)
  public IPITrib?: IIPITrib;

  @IsOptional()
  @ValidateNested()
  @Type(() => IPINT)
  public IPINT?: IIPINT;
}
