import {
  IsArray,
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type {
  RefNF as IRefNF,
  RefNFP as IRefNFP,
  Ide as IIde,
  RefECF as IRefECF,
  NFref as INFref,
} from 'src/entities/nfe/inf-nfe/ide';

export class RefNF implements IRefNF {
  @IsDefined()
  @IsString()
  declare cUF: string;

  @IsDefined()
  @IsString()
  declare AAMM: string;

  @IsDefined()
  @IsString()
  declare CNPJ: string;

  @IsDefined()
  @IsString()
  declare mod: string;

  @IsDefined()
  @IsString()
  declare serie: string;

  @IsDefined()
  @IsString()
  declare nNF: string;
}

export class RefNFP implements IRefNFP {
  @IsDefined()
  @IsString()
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
  declare mod: string;

  @IsDefined()
  @IsString()
  declare serie: string;

  @IsDefined()
  @IsString()
  declare nNF: string;
}

export class RefECF implements IRefECF {
  @IsDefined()
  @IsString()
  declare mod: string;

  @IsDefined()
  @IsString()
  declare nECF: string;

  @IsDefined()
  @IsString()
  declare nCOO: string;
}

export class NFref implements INFref {
  @IsOptional()
  @IsString()
  declare refNFe?: string;

  @IsOptional()
  @IsString()
  declare refNFeSig?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RefNF)
  declare refNF?: IRefNF;

  @IsOptional()
  @ValidateNested()
  @Type(() => RefNFP)
  declare refNFP?: IRefNFP;

  @IsOptional()
  @IsString()
  declare refCTe?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RefECF)
  declare refECF?: IRefECF;
}

export class Ide implements IIde {
  @IsDefined()
  @IsString()
  declare cUF: string;

  @IsDefined()
  @IsString()
  declare cNF: string;

  @IsDefined()
  @IsString()
  declare natOp: string;

  @IsDefined()
  @IsString()
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
  declare tpNF: string;

  @IsDefined()
  @IsString()
  declare idDest: string;

  @IsDefined()
  @IsString()
  declare cMunFG: string;

  @IsDefined()
  @IsString()
  declare tpImp: string;

  @IsDefined()
  @IsString()
  declare tpEmis: string;

  @IsDefined()
  @IsString()
  declare cDV: string;

  @IsDefined()
  @IsString()
  declare tpAmb: string;

  @IsDefined()
  @IsString()
  declare finNFe: string;

  @IsDefined()
  @IsString()
  declare indFinal: string;

  @IsDefined()
  @IsString()
  declare indPres: string;

  @IsOptional()
  @IsString()
  declare indIntermed?: string;

  @IsDefined()
  @IsString()
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
  declare NFref?: INFref[];
}
