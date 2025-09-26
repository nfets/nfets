import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';
import { Prod as IProd } from 'src/entities/nfe/inf-nfe/det/prod';

export class Prod implements IProd {
  @IsString()
  public cProd!: string;

  @IsString()
  public cEAN!: string;

  @IsOptional()
  @IsString()
  public cBarra?: string;

  @IsString()
  public xProd!: string;

  @IsString()
  public NCM!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public NVE?: string[];

  @IsOptional()
  @IsString()
  public CEST?: string;

  @IsOptional()
  @IsString()
  public indEscala?: string;

  @IsOptional()
  @IsString()
  public CNPJFab?: string;

  @IsOptional()
  @IsString()
  public cBenef?: string;

  @IsOptional()
  @IsObject()
  public gCred?: unknown;

  @IsOptional()
  @IsString()
  public EXTIPI?: string;

  @IsString()
  public CFOP!: string;

  @IsString()
  public uCom!: string;

  @IsString()
  public qCom!: string;

  @IsString()
  public vUnCom!: string;

  @IsString()
  public vProd!: string;

  @IsString()
  public cEANTrib!: string;

  @IsString()
  public uTrib!: string;

  @IsString()
  public qTrib!: string;

  @IsString()
  public vUnTrib!: string;

  @IsOptional()
  @IsString()
  public vFrete?: string;

  @IsOptional()
  @IsString()
  public vSeg?: string;

  @IsOptional()
  @IsString()
  public vDesc?: string;

  @IsOptional()
  @IsString()
  public vOutro?: string;

  @IsString()
  public indTot!: string;

  @IsOptional()
  @IsString()
  public xPed?: string;

  @IsOptional()
  @IsString()
  public nItemPed?: string;

  @IsOptional()
  @IsString()
  public nFCI?: string;
}
