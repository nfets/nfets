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
  public xCampo!: string;

  @IsString()
  public xTexto!: string;
}

export class ObsFisco implements IObsFisco {
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
  @Type(() => ObsCont)
  public obsCont?: IObsCont[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ObsFisco)
  public obsFisco?: IObsFisco[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProcRef)
  public procRef?: IProcRef[];
}
