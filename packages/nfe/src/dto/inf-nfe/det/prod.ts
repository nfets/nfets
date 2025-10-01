import type { DecimalValue } from '@nfets/core';
import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';
import { Prod as IProd } from 'src/entities/nfe/inf-nfe/det/prod';
import { IsDecimal } from 'src/application/validator/decimal';

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

  @IsDecimal()
  public qCom!: DecimalValue;

  @IsDecimal()
  public vUnCom!: DecimalValue;

  @IsDecimal()
  public vProd!: DecimalValue;

  @IsString()
  public cEANTrib!: string;

  @IsString()
  public uTrib!: string;

  @IsDecimal()
  public qTrib!: DecimalValue;

  @IsDecimal()
  public vUnTrib!: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vFrete?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vSeg?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vDesc?: DecimalValue;

  @IsOptional()
  @IsDecimal()
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
