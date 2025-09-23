import {
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import type {
  COFINSAliq as ICOFINSAliq,
  COFINSQtde as ICOFINSQtde,
  COFINSNT as ICOFINSNT,
  COFINSOutr as ICOFINSOutr,
  COFINS as ICOFINS,
  COFINSST as ICOFINSST,
} from 'src/entities/nfe/inf-nfe/det/imposto/cofins';

export class COFINSAliq implements ICOFINSAliq {
  @IsDefined()
  @IsString()
  declare CST: string;

  @IsOptional()
  @IsString()
  declare vBC?: string;

  @IsOptional()
  @IsString()
  declare pCOFINS?: string;

  @IsOptional()
  @IsString()
  declare vCOFINS?: string;
}

export class COFINSQtde implements ICOFINSQtde {
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
  declare vCOFINS?: string;
}

export class COFINSNT implements ICOFINSNT {
  @IsDefined()
  @IsString()
  declare CST: string;
}

export class COFINSOutr implements ICOFINSOutr {
  @IsDefined()
  @IsString()
  declare CST: string;

  @IsOptional()
  @IsString()
  declare vBC?: string;

  @IsOptional()
  @IsString()
  declare pCOFINS?: string;

  @IsOptional()
  @IsString()
  declare qBCProd?: string;

  @IsOptional()
  @IsString()
  declare vAliqProd?: string;

  @IsOptional()
  @IsString()
  declare vCOFINS?: string;
}

export class COFINS implements ICOFINS {
  @IsOptional()
  @ValidateNested()
  @Type(() => COFINSAliq)
  declare COFINSAliq?: COFINSAliq;

  @IsOptional()
  @ValidateNested()
  @Type(() => COFINSQtde)
  declare COFINSQtde?: COFINSQtde;

  @IsOptional()
  @ValidateNested()
  @Type(() => COFINSNT)
  declare COFINSNT?: COFINSNT;

  @IsOptional()
  @ValidateNested()
  @Type(() => COFINSOutr)
  declare COFINSOutr?: COFINSOutr;
}

export class COFINSST implements ICOFINSST {
  @IsOptional()
  @IsString()
  declare vBC?: string;

  @IsOptional()
  @IsString()
  declare pCOFINS?: string;

  @IsOptional()
  @IsString()
  declare qBCProd?: string;

  @IsOptional()
  @IsString()
  declare vAliqProd?: string;

  @IsOptional()
  @IsString()
  declare vCOFINS?: string;
}
