import {
  IsString,
  IsOptional,
  IsObject,
  ValidateNested,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsDecimal } from 'src/application/validator/decimal';

import type { DecimalValue } from '@nfets/core';
import type {
  Comb as IComb,
  CIDE as ICIDE,
  Encerrante as IEncerrante,
  OrigComb as IOrigComb,
} from 'src/entities/nfe/inf-nfe/det/comb';

export class OrigComb implements IOrigComb {
  @IsString()
  public indImport!: string;

  @IsString()
  public cUFOrig!: string;

  @IsDecimal()
  public pOrig!: DecimalValue;
}

export class CIDE implements ICIDE {
  @IsDecimal()
  public qBCProd!: DecimalValue;

  @IsDecimal()
  public vAliqProd!: DecimalValue;

  @IsDecimal()
  public vCIDE!: DecimalValue;
}

export class Encerrante implements IEncerrante {
  @IsString()
  public nBico!: string;

  @IsString()
  public nBomba?: string;

  @IsString()
  public nTanque!: string;

  @IsDecimal()
  public vEncIni!: DecimalValue;

  @IsDecimal()
  public vEncFin!: DecimalValue;
}

export class Comb implements IComb {
  @IsString()
  public cProdANP!: string;

  @IsString()
  public descANP!: string;

  @IsDecimal()
  @IsOptional()
  public pGLP?: DecimalValue;

  @IsDecimal()
  @IsOptional()
  public pGNn?: DecimalValue;

  @IsDecimal()
  @IsOptional()
  public pGNi?: DecimalValue;

  @IsDecimal()
  @IsOptional()
  public vPart?: DecimalValue;

  @IsString()
  @IsOptional()
  public CODIF?: string;

  @IsDecimal()
  @IsOptional()
  public qTemp?: DecimalValue;

  @IsString()
  public UFCons!: string;

  @IsObject()
  @ValidateNested()
  @Type(() => CIDE)
  public CIDE!: ICIDE;

  @IsObject()
  @ValidateNested()
  @Type(() => Encerrante)
  public encerrante!: IEncerrante;

  @IsDecimal()
  @IsOptional()
  public pBio?: DecimalValue;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => OrigComb)
  @ArrayMaxSize(30)
  @IsOptional()
  public origComb?: IOrigComb[];
}
