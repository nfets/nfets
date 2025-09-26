import type { DecimalValue } from '@nfets/core';
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
  public qCom!: DecimalValue;

  @IsString()
  public vUnCom!: DecimalValue;

  @IsString()
  public vProd!: DecimalValue;

  @IsString()
  public cEANTrib!: string;

  @IsString()
  public uTrib!: string;

  @IsString()
  public qTrib!: DecimalValue;

  @IsString()
  public vUnTrib!: DecimalValue;

  @IsOptional()
  @IsString()
  public vFrete?: DecimalValue;

  @IsOptional()
  @IsString()
  public vSeg?: DecimalValue;

  @IsOptional()
  @IsString()
  public vDesc?: DecimalValue;

  @IsOptional()
  @IsString()
  public vOutro?: DecimalValue;

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
