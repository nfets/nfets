import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import type {
  PISAliq as IPISAliq,
  PISQtde as IPISQtde,
  PISNT as IPISNT,
  PISOutr as IPISOutr,
  PISST as IPISST,
  PIS as IPIS,
} from 'src/entities/nfe/inf-nfe/det/imposto/pis';

export class PISAliq implements IPISAliq {
  @IsString()
  public CST!: string;

  @IsOptional()
  @IsString()
  public vBC?: string;

  @IsOptional()
  @IsString()
  public pPIS?: string;

  @IsOptional()
  @IsString()
  public vPIS?: string;
}

export class PISQtde implements IPISQtde {
  @IsString()
  public CST!: string;

  @IsOptional()
  @IsString()
  public qBCProd?: string;

  @IsOptional()
  @IsString()
  public vAliqProd?: string;

  @IsOptional()
  @IsString()
  public vPIS?: string;
}

export class PISNT implements IPISNT {
  @IsString()
  public CST!: string;
}

export class PISOutr implements IPISOutr {
  @IsString()
  public CST!: string;

  @IsOptional()
  @IsString()
  public vBC?: string;

  @IsOptional()
  @IsString()
  public pPIS?: string;

  @IsOptional()
  @IsString()
  public qBCProd?: string;

  @IsOptional()
  @IsString()
  public vAliqProd?: string;

  @IsOptional()
  @IsString()
  public vPIS?: string;
}

export class PIS implements IPIS {
  @IsOptional()
  @ValidateNested()
  @Type(() => PISAliq)
  public PISAliq?: PISAliq;

  @IsOptional()
  @ValidateNested()
  @Type(() => PISQtde)
  public PISQtde?: PISQtde;

  @IsOptional()
  @ValidateNested()
  @Type(() => PISNT)
  public PISNT?: PISNT;

  @IsOptional()
  @ValidateNested()
  @Type(() => PISOutr)
  public PISOutr?: PISOutr;
}

export class PISST implements IPISST {
  @IsOptional()
  @IsString()
  public vBC?: string;

  @IsOptional()
  @IsString()
  public pPIS?: string;

  @IsOptional()
  @IsString()
  public qBCProd?: string;

  @IsOptional()
  @IsString()
  public vAliqProd?: string;

  @IsOptional()
  @IsString()
  public vPIS?: string;
}
