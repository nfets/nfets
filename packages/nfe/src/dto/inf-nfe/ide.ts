import {
  IsArray,
  IsDefined,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RefNF {
  @IsDefined()
  @IsString()
  @IsIn([
    '11', '12', '13', '14', '15', '16', '17', '21', '22', '23', '24', '25', '26', '27', '28', '29', '31', '32', '33', '35', '41', '42', '43', '50', '51', '52', '53',
  ])
  declare cUF: string;

  @IsDefined()
  @IsString()
  declare AAMM: string;

  @IsDefined()
  @IsString()
  declare CNPJ: string;

  @IsDefined()
  @IsString()
  @IsIn(['01', '02'])
  declare mod: string;

  @IsDefined()
  @IsString()
  declare serie: string;

  @IsDefined()
  @IsString()
  declare nNF: string;
}

export class RefNFP {
  @IsDefined()
  @IsString()
  @IsIn([
    '11', '12', '13', '14', '15', '16', '17', '21', '22', '23', '24', '25', '26', '27', '28', '29', '31', '32', '33', '35', '41', '42', '43', '50', '51', '52', '53',
  ])
  declare cUF: string;

  @IsDefined()
  @IsString()
  declare AAMM: string;

  @IsOptional()
  @IsString()
  declare CNPJ?: string;

  @IsOptional()
  @IsString()
  declare CPF?: string;

  @IsDefined()
  @IsString()
  declare IE: string;

  @IsDefined()
  @IsString()
  @IsIn(['01', '04'])
  declare mod: string;

  @IsDefined()
  @IsString()
  declare serie: string;

  @IsDefined()
  @IsString()
  declare nNF: string;
}

export class RefECF {
  @IsDefined()
  @IsString()
  @IsIn(['2B', '2C', '2D'])
  declare mod: string;

  @IsDefined()
  @IsString()
  declare nECF: string;

  @IsDefined()
  @IsString()
  declare nCOO: string;
}

export class NFref {
  @IsOptional()
  @IsString()
  declare refNFe?: string;

  @IsOptional()
  @IsString()
  declare refNFeSig?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RefNF)
  declare refNF?: RefNF;

  @IsOptional()
  @ValidateNested()
  @Type(() => RefNFP)
  declare refNFP?: RefNFP;

  @IsOptional()
  @IsString()
  declare refCTe?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RefECF)
  declare refECF?: RefECF;
}

export class Ide {
  @IsDefined()
  @IsString()
  @IsIn([
    '11', '12', '13', '14', '15', '16', '17', '21', '22', '23', '24', '25', '26', '27', '28', '29', '31', '32', '33', '35', '41', '42', '43', '50', '51', '52', '53',
  ])
  declare cUF: string;

  @IsDefined()
  @IsString()
  declare cNF: string;

  @IsDefined()
  @IsString()
  declare natOp: string;

  @IsDefined()
  @IsString()
  @IsIn(['55', '65'])
  declare mod: string;

  @IsDefined()
  @IsString()
  declare serie: string;

  @IsDefined()
  @IsString()
  declare nNF: string;

  @IsDefined()
  @IsString()
  declare dhEmi: string;

  @IsOptional()
  @IsString()
  declare dhSaiEnt?: string;

  @IsDefined()
  @IsString()
  @IsIn(['0', '1'])
  declare tpNF: string;

  @IsDefined()
  @IsString()
  @IsIn(['1', '2', '3'])
  declare idDest: string;

  @IsDefined()
  @IsString()
  declare cMunFG: string;

  @IsDefined()
  @IsString()
  @IsIn(['0', '1', '2', '3', '4', '5'])
  declare tpImp: string;

  @IsDefined()
  @IsString()
  @IsIn(['1', '2', '3', '4', '5', '6', '7', '9'])
  declare tpEmis: string;

  @IsDefined()
  @IsString()
  declare cDV: string;

  @IsDefined()
  @IsString()
  @IsIn(['1', '2'])
  declare tpAmb: string;

  @IsDefined()
  @IsString()
  @IsIn(['1', '2', '3', '4'])
  declare finNFe: string;

  @IsDefined()
  @IsString()
  @IsIn(['0', '1'])
  declare indFinal: string;

  @IsDefined()
  @IsString()
  @IsIn(['0', '1', '2', '3', '4', '5', '9'])
  declare indPres: string;

  @IsOptional()
  @IsString()
  @IsIn(['0', '1'])
  declare indIntermed?: string;

  @IsDefined()
  @IsString()
  @IsIn(['0', '1', '2', '3'])
  declare procEmi: string;

  @IsDefined()
  @IsString()
  declare verProc: string;

  @IsOptional()
  @IsString()
  declare dhCont?: string;

  @IsOptional()
  @IsString()
  declare xJust?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NFref)
  declare NFref?: NFref[];
}
