import { IsString } from 'class-validator';

import type { VeicProd as IVeicProd } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/veic-prod';

export class VeicProd implements IVeicProd {
  @IsString()
  public tpOp!: string;

  @IsString()
  public chassi!: string;

  @IsString()
  public cCor!: string;

  @IsString()
  public xCor!: string;

  @IsString()
  public pot!: string;

  @IsString()
  public cilin!: string;

  @IsString()
  public pesoL!: string;

  @IsString()
  public pesoB!: string;

  @IsString()
  public nSerie!: string;

  @IsString()
  public tpComb!: string;

  @IsString()
  public nMotor!: string;

  @IsString()
  public CMT!: string;

  @IsString()
  public dist!: string;

  @IsString()
  public anoMod!: string;

  @IsString()
  public anoFab!: string;

  @IsString()
  public tpPint!: string;

  @IsString()
  public tpVeic!: string;

  @IsString()
  public espVeic!: string;

  @IsString()
  public VIN!: string;

  @IsString()
  public condVeic!: string;

  @IsString()
  public cMod!: string;

  @IsString()
  public cCorDENATRAN!: string;

  @IsString()
  public lota!: string;

  @IsString()
  public tpRest!: string;
}
