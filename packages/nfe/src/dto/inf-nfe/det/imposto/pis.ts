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
  declare CST: string;

  @IsOptional()
  @IsString()
  declare vBC?: string;

  @IsOptional()
  @IsString()
  declare pPIS?: string;

  @IsOptional()
  @IsString()
  declare vPIS?: string;
}

export class PISQtde implements IPISQtde {
  @IsString()
  declare CST: string;

  @IsOptional()
  @IsString()
  declare qBCProd?: string;

  @IsOptional()
  @IsString()
  declare vAliqProd?: string;

  @IsOptional()
  @IsString()
  declare vPIS?: string;
}

export class PISNT implements IPISNT {
  @IsString()
  declare CST: string;
}

export class PISOutr implements IPISOutr {
  @IsString()
  declare CST: string;

  @IsOptional()
  @IsString()
  declare vBC?: string;

  @IsOptional()
  @IsString()
  declare pPIS?: string;

  @IsOptional()
  @IsString()
  declare qBCProd?: string;

  @IsOptional()
  @IsString()
  declare vAliqProd?: string;

  @IsOptional()
  @IsString()
  declare vPIS?: string;
}

export class PIS implements IPIS {
  @IsOptional()
  @ValidateNested()
  @Type(() => PISAliq)
  declare PISAliq?: PISAliq;

  @IsOptional()
  @ValidateNested()
  @Type(() => PISQtde)
  declare PISQtde?: PISQtde;

  @IsOptional()
  @ValidateNested()
  @Type(() => PISNT)
  declare PISNT?: PISNT;

  @IsOptional()
  @ValidateNested()
  @Type(() => PISOutr)
  declare PISOutr?: PISOutr;
}

export class PISST implements IPISST {
  @IsOptional()
  @IsString()
  declare vBC?: string;

  @IsOptional()
  @IsString()
  declare pPIS?: string;

  @IsOptional()
  @IsString()
  declare qBCProd?: string;

  @IsOptional()
  @IsString()
  declare vAliqProd?: string;

  @IsOptional()
  @IsString()
  declare vPIS?: string;
}
