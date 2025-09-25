import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import type {
  ObsCont as IObsCont,
  ObsFisco as IObsFisco,
  ProcRef as IProcRef,
  InfAdic as IInfAdic,
} from 'src/entities/nfe/inf-nfe/infadic';

export class ObsCont implements IObsCont {
  @IsString()
  declare xCampo: string;

  @IsString()
  declare xTexto: string;
}

export class ObsFisco implements IObsFisco {
  @IsString()
  declare xCampo: string;

  @IsString()
  declare xTexto: string;
}

export class ProcRef implements IProcRef {
  @IsOptional()
  @IsString()
  declare nProc?: string;

  @IsOptional()
  @IsString()
  declare indProc?: string;
}

export class InfAdic implements IInfAdic {
  @IsOptional()
  @IsString()
  declare infAdFisco?: string;

  @IsOptional()
  @IsString()
  declare infCpl?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ObsCont)
  declare obsCont?: IObsCont[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ObsFisco)
  declare obsFisco?: IObsFisco[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProcRef)
  declare procRef?: IProcRef[];
}
