import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
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
  CompraGov as ICompraGov,
  PagAntecipado as IPagAntecipado,
} from '@nfets/nfe/domain/entities/nfe/inf-nfe/ide';
import { Choice, TransformDateString, TransformDecimal } from '@nfets/core/application';
import type { TpEmis } from '@nfets/nfe/domain/entities/constants/tp-emis';
import { type StateCode, type EnvironmentCode, StateCodes } from '@nfets/core';
import type { DecimalValue } from '@nfets/core/domain';

export class RefNF implements IRefNF {
  @IsString()
  public cUF!: string;

  @IsString()
  public AAMM!: string;

  @IsString()
  public CNPJ!: string;

  @IsString()
  public mod!: string;

  @IsString()
  public serie!: string;

  @IsString()
  public nNF!: string;
}

@Choice<IRefNFP>({ properties: ['CNPJ', 'CPF'], required: true })
export class RefNFP implements IRefNFP {
  @IsString()
  public cUF!: string;

  @IsString()
  public AAMM!: string;

  @IsOptional()
  @IsString()
  public CNPJ?: string = '' as const;

  @IsOptional()
  @IsString()
  public CPF?: string = '' as const;

  @IsString()
  public IE!: string;

  @IsString()
  public mod!: string;

  @IsString()
  public serie!: string;

  @IsString()
  public nNF!: string;
}

export class RefECF implements IRefECF {
  @IsString()
  public mod!: string;

  @IsString()
  public nECF!: string;

  @IsString()
  public nCOO!: string;
}

export class NFref implements INFref {
  @IsOptional()
  @IsString()
  public refNFe?: string;

  @IsOptional()
  @IsString()
  public refNFeSig?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RefNF)
  public refNF?: IRefNF;

  @IsOptional()
  @ValidateNested()
  @Type(() => RefNFP)
  public refNFP?: IRefNFP;

  @IsOptional()
  @IsString()
  public refCTe?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RefECF)
  public refECF?: IRefECF;
}

export class CompraGov implements ICompraGov {
  @IsString()
  public tpEnteGov!: string;

  @TransformDecimal({ fixed: 4 })
  public pRedutor!: DecimalValue;

  @IsString()
  public tpOperGov!: string;

  @IsOptional()
  @IsString()
  public refDFeAnt?: string;
}

export class PagAntecipado implements IPagAntecipado {
  @IsArray()
  @ArrayMaxSize(99)
  @IsString({ each: true })
  public refNFe!: string[];
}

export class Ide implements IIde {
  @IsEnum(StateCodes)
  public cUF!: StateCode;

  @IsString()
  public cNF!: string;

  @IsString()
  public natOp!: string;

  @IsString()
  public mod!: string;

  @IsString()
  public serie!: string;

  @IsString()
  public nNF!: string;

  @TransformDateString({ format: 'YYYY-MM-DD[T]HH:mm:ssZ' })
  public dhEmi!: string;

  @IsOptional()
  @TransformDateString({ format: 'YYYY-MM-DD[T]HH:mm:ssZ' })
  public dhSaiEnt?: string;

  @IsOptional()
  @TransformDateString({ format: 'YYYY-MM-DD' })
  public dPrevEntrega?: string;

  @IsString()
  public tpNF!: string;

  @IsString()
  public idDest!: string;

  @IsString()
  public cMunFG!: string;

  @IsOptional()
  @IsString()
  public cMunFGIBS?: string;

  @IsString()
  public tpImp!: string;

  @IsString()
  public tpEmis!: TpEmis;

  @IsString()
  @IsOptional()
  public cDV?: string = '' as const;

  @IsString()
  public tpAmb!: EnvironmentCode;

  @IsString()
  public finNFe!: string;

  @IsOptional()
  @IsString()
  public tpNFDebito?: string;

  @IsOptional()
  @IsString()
  public tpNFCredito?: string;

  @IsString()
  public indFinal!: string;

  @IsString()
  public indPres!: string;

  @IsOptional()
  @IsString()
  public indIntermed?: string;

  @IsOptional()
  @IsString()
  public cIndOp?: string;

  @IsString()
  public procEmi!: string;

  @IsString()
  public verProc!: string;

  @IsOptional()
  @IsString()
  @TransformDateString({ format: 'YYYY-MM-DD[T]HH:mm:ssZ' })
  public dhCont?: string;

  @IsOptional()
  @IsString()
  public xJust?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(999)
  @ValidateNested({ each: true })
  @Type(() => NFref)
  public NFref?: INFref[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CompraGov)
  public gCompraGov?: ICompraGov;

  @IsOptional()
  @ValidateNested()
  @Type(() => PagAntecipado)
  public gPagAntecipado?: IPagAntecipado;
}
