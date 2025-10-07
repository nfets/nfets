import {
  ArrayMaxSize,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import type {
  ProcRef as IProcRef,
  InfAdic as IInfAdic,
  InfAdicObs as IInfAdicObs,
} from '@nfets/nfe/entities/nfe/inf-nfe/infadic';

export class InfAdicObs implements IInfAdicObs {
  @IsString()
  public xCampo!: string;

  @IsString()
  public xTexto!: string;
}

export class ProcRef implements IProcRef {
  @IsOptional()
  @IsString()
  public nProc?: string;

  @IsOptional()
  @IsString()
  public indProc?: string;
}

export class InfAdic implements IInfAdic {
  @IsOptional()
  @IsString()
  public infAdFisco?: string;

  @IsOptional()
  @IsString()
  public infCpl?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => InfAdicObs)
  @ArrayMaxSize(10)
  public obsCont?: InfAdicObs[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => InfAdicObs)
  @ArrayMaxSize(10)
  public obsFisco?: IInfAdicObs[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProcRef)
  @ArrayMaxSize(100)
  public procRef?: IProcRef[];
}
