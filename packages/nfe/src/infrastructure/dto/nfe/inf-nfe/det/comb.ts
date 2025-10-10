import {
  IsString,
  IsOptional,
  IsObject,
  ValidateNested,
  ArrayMaxSize,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransformDecimal } from '@nfets/core/application';

import type { DecimalValue } from '@nfets/core/domain';
import type {
  Comb as IComb,
  CIDE as ICIDE,
  Encerrante as IEncerrante,
  OrigComb as IOrigComb,
} from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/comb';

export class OrigComb implements IOrigComb {
  @IsString()
  public indImport!: string;

  @IsString()
  public cUFOrig!: string;

  @TransformDecimal({ fixed: 4 })
  @Max(100)
  public pOrig!: DecimalValue;
}

export class CIDE implements ICIDE {
  @TransformDecimal({ fixed: 4 })
  public qBCProd!: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public vAliqProd!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vCIDE!: DecimalValue;
}

export class Encerrante implements IEncerrante {
  @IsString()
  public nBico!: string;

  @IsString()
  public nBomba?: string;

  @IsString()
  public nTanque!: string;

  @TransformDecimal({ fixed: 3 })
  public vEncIni!: DecimalValue;

  @TransformDecimal({ fixed: 3 })
  public vEncFin!: DecimalValue;
}

export class Comb implements IComb {
  @IsString()
  public cProdANP!: string;

  @IsString()
  public descANP!: string;

  @IsOptional()
  @Max(100)
  @TransformDecimal({ fixed: 4 })
  public pGLP?: DecimalValue;

  @IsOptional()
  @Max(100)
  @TransformDecimal({ fixed: 4 })
  public pGNn?: DecimalValue;

  @IsOptional()
  @Max(100)
  @TransformDecimal({ fixed: 4 })
  public pGNi?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vPart?: DecimalValue;

  @IsString()
  @IsOptional()
  public CODIF?: string;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
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

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pBio?: DecimalValue;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => OrigComb)
  @ArrayMaxSize(30)
  @IsOptional()
  public origComb?: IOrigComb[];
}
