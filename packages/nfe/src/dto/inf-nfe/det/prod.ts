import {
  IsArray,
  IsDefined,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Prod as IProd } from 'src/entities/nfe/inf-nfe/det/prod';

export class Prod implements IProd {
  @IsDefined()
  @IsString()
  declare cProd: string;

  @IsDefined()
  @IsString()
  declare cEAN: string;

  @IsOptional()
  @IsString()
  declare cBarra?: string;

  @IsDefined()
  @IsString()
  declare xProd: string;

  @IsDefined()
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

  @IsDefined()
  @IsString()
  declare CFOP: string;

  @IsDefined()
  @IsString()
  declare uCom: string;

  @IsDefined()
  @IsString()
  declare qCom: string;

  @IsDefined()
  @IsString()
  declare vUnCom: string;

  @IsDefined()
  @IsString()
  declare vProd: string;

  @IsDefined()
  @IsString()
  declare cEANTrib: string;

  @IsDefined()
  @IsString()
  declare uTrib: string;

  @IsDefined()
  @IsString()
  declare qTrib: string;

  @IsDefined()
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

  @IsDefined()
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
