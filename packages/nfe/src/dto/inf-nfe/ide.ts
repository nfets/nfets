import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import type {
  RefNF as IRefNF,
  RefNFP as IRefNFP,
  Ide as IIde,
  RefECF as IRefECF,
  NFref as INFref,
} from 'src/entities/nfe/inf-nfe/ide';

export class RefNF implements IRefNF {
  @IsString()
  declare cUF: string;

  @IsString()
  declare AAMM: string;

  @IsString()
  declare CNPJ: string;

  @IsString()
  declare mod: string;

  @IsString()
  declare serie: string;

  @IsString()
  declare nNF: string;
}

export class RefNFP implements IRefNFP {
  @IsString()
  declare cUF: string;

  @IsString()
  declare AAMM: string;

  @IsOptional()
  @IsString()
  declare CNPJ?: string;

  @IsOptional()
  @IsString()
  declare CPF?: string;

  @IsString()
  declare IE: string;

  @IsString()
  declare mod: string;

  @IsString()
  declare serie: string;

  @IsString()
  declare nNF: string;
}

export class RefECF implements IRefECF {
  @IsString()
  declare mod: string;

  @IsString()
  declare nECF: string;

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
  @IsString()
  declare cUF: string;

  @IsString()
  declare cNF: string;

  @IsString()
  declare natOp: string;

  @IsString()
  declare mod: string;

  @IsString()
  declare serie: string;

  @IsString()
  declare nNF: string;

  @IsString()
  declare dhEmi: string;

  @IsOptional()
  @IsString()
  declare dhSaiEnt?: string;

  @IsString()
  declare tpNF: string;

  @IsString()
  declare idDest: string;

  @IsString()
  declare cMunFG: string;

  @IsString()
  declare tpImp: string;

  @IsString()
  declare tpEmis: string;

  @IsString()
  declare cDV: string;

  @IsString()
  declare tpAmb: string;

  @IsString()
  declare finNFe: string;

  @IsString()
  declare indFinal: string;

  @IsString()
  declare indPres: string;

  @IsOptional()
  @IsString()
  declare indIntermed?: string;

  @IsString()
  declare procEmi: string;

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
