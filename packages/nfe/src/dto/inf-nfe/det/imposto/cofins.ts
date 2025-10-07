import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import type {
  COFINSAliq as ICOFINSAliq,
  COFINSQtde as ICOFINSQtde,
  COFINSNT as ICOFINSNT,
  COFINSOutr as ICOFINSOutr,
  COFINS as ICOFINS,
  COFINSST as ICOFINSST,
} from '@nfets/nfe/entities/nfe/inf-nfe/det/imposto/cofins';

export class COFINSAliq implements ICOFINSAliq {
  @IsString()
  public CST!: string;

  @IsOptional()
  @IsString()
  public vBC?: string;

  @IsOptional()
  @IsString()
  public pCOFINS?: string;

  @IsOptional()
  @IsString()
  public vCOFINS?: string;
}

export class COFINSQtde implements ICOFINSQtde {
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
  public vCOFINS?: string;
}

export class COFINSNT implements ICOFINSNT {
  @IsString()
  public CST!: string;
}

export class COFINSOutr implements ICOFINSOutr {
  @IsString()
  public CST!: string;

  @IsOptional()
  @IsString()
  public vBC?: string;

  @IsOptional()
  @IsString()
  public pCOFINS?: string;

  @IsOptional()
  @IsString()
  public qBCProd?: string;

  @IsOptional()
  @IsString()
  public vAliqProd?: string;

  @IsOptional()
  @IsString()
  public vCOFINS?: string;
}

export class COFINS implements ICOFINS {
  @IsOptional()
  @ValidateNested()
  @Type(() => COFINSAliq)
  public COFINSAliq?: COFINSAliq;

  @IsOptional()
  @ValidateNested()
  @Type(() => COFINSQtde)
  public COFINSQtde?: COFINSQtde;

  @IsOptional()
  @ValidateNested()
  @Type(() => COFINSNT)
  public COFINSNT?: COFINSNT;

  @IsOptional()
  @ValidateNested()
  @Type(() => COFINSOutr)
  public COFINSOutr?: COFINSOutr;
}

export class COFINSST implements ICOFINSST {
  @IsOptional()
  @IsString()
  public vBC?: string;

  @IsOptional()
  @IsString()
  public pCOFINS?: string;

  @IsOptional()
  @IsString()
  public qBCProd?: string;

  @IsOptional()
  @IsString()
  public vAliqProd?: string;

  @IsOptional()
  @IsString()
  public vCOFINS?: string;
}
