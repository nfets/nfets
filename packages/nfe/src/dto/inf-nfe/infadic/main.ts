import {
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ObsCont {
  @IsDefined()
  @IsString()
  declare xCampo: string;

  @IsDefined()
  @IsString()
  declare xTexto: string;
}

export class ObsFisco {
  @IsDefined()
  @IsString()
  declare xCampo: string;

  @IsDefined()
  @IsString()
  declare xTexto: string;
}

export class ProcRef {
  @IsOptional()
  @IsString()
  declare nProc?: string;

  @IsOptional()
  @IsString()
  declare indProc?: string;
}

export class InfAdic {
  @IsOptional()
  @IsString()
  declare infAdFisco?: string;

  @IsOptional()
  @IsString()
  declare infCpl?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ObsCont)
  declare obsCont?: ObsCont[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ObsFisco)
  declare obsFisco?: ObsFisco[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProcRef)
  declare procRef?: ProcRef[];
}
