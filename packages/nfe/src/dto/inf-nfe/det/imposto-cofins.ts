import {
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class COFINSAliq {
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

export class COFINSQtde {
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

export class COFINSNT {
  @IsDefined()
  @IsString()
  declare CST: string;
}

export class COFINSOutr {
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

export class COFINS {
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

export class COFINSST {
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
