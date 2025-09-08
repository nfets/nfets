import {
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PISAliq {
  @IsDefined()
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

export class PISQtde {
  @IsDefined()
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

export class PISNT {
  @IsDefined()
  @IsString()
  declare CST: string;
}

export class PISOutr {
  @IsDefined()
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

export class PIS {
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

export class PISST {
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
