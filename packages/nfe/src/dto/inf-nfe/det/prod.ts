import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';
import { Prod as IProd } from 'src/entities/nfe/inf-nfe/det/prod';

export class Prod implements IProd {
  @IsString()
  declare cProd: string;

  @IsString()
  declare cEAN: string;

  @IsOptional()
  @IsString()
  declare cBarra?: string;

  @IsString()
  declare xProd: string;

  @IsString()
  declare NCM: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  declare NVE?: string[];

  @IsOptional()
  @IsString()
  declare CEST?: string;

  @IsOptional()
  @IsString()
  declare indEscala?: string;

  @IsOptional()
  @IsString()
  declare CNPJFab?: string;

  @IsOptional()
  @IsString()
  declare cBenef?: string;

  @IsOptional()
  @IsObject()
  declare gCred?: unknown;

  @IsOptional()
  @IsString()
  declare EXTIPI?: string;

  @IsString()
  declare CFOP: string;

  @IsString()
  declare uCom: string;

  @IsString()
  declare qCom: string;

  @IsString()
  declare vUnCom: string;

  @IsString()
  declare vProd: string;

  @IsString()
  declare cEANTrib: string;

  @IsString()
  declare uTrib: string;

  @IsString()
  declare qTrib: string;

  @IsString()
  declare vUnTrib: string;

  @IsOptional()
  @IsString()
  declare vFrete?: string;

  @IsOptional()
  @IsString()
  declare vSeg?: string;

  @IsOptional()
  @IsString()
  declare vDesc?: string;

  @IsOptional()
  @IsString()
  declare vOutro?: string;

  @IsString()
  declare indTot: string;

  @IsOptional()
  @IsString()
  declare xPed?: string;

  @IsOptional()
  @IsString()
  declare nItemPed?: string;

  @IsOptional()
  @IsString()
  declare nFCI?: string;
}
