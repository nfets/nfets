import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Case } from 'src/application/validator/switch-case';
import { IsDecimal } from 'src/application/validator/decimal';

import type { DecimalValue } from '@nfets/core';
import type {
  ICMS00 as IICMS00,
  ICMS10 as IICMS10,
  ICMS20 as IICMS20,
  ICMS30 as IICMS30,
  ICMS40 as IICMS40,
  ICMS51 as IICMS51,
  ICMS60 as IICMS60,
  ICMS70 as IICMS70,
  ICMS90 as IICMS90,
} from 'src/entities/nfe/inf-nfe/det/imposto/icms';

import type {
  ICMSSN101 as IICMSSN101,
  ICMSSN102 as IICMSSN102,
  ICMSSN201 as IICMSSN201,
  ICMSSN202 as IICMSSN202,
  ICMSSN500 as IICMSSN500,
  ICMSSN900 as IICMSSN900,
} from 'src/entities/nfe/inf-nfe/det/imposto/icms';
import type { ICMSST as IICMSST } from 'src/entities/nfe/inf-nfe/det/imposto/icms';
import type { ICMSPart as IICMSPart } from 'src/entities/nfe/inf-nfe/det/imposto/icms';
import type { ICMS as IICMS } from 'src/entities/nfe/inf-nfe/det/imposto/icms';

export class ICMS00 implements IICMS00 {
  @IsString()
  public orig!: string;

  @IsString()
  public CST!: string;

  @IsOptional()
  @IsString()
  public modBC?: string;

  @IsOptional()
  @IsDecimal()
  public vBC?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pICMS?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vICMS?: DecimalValue;
}

export class ICMS10 implements IICMS10 {
  @IsString()
  public orig!: string;

  @IsString()
  public CST!: string;

  @IsOptional()
  @IsString()
  public modBC?: string;

  @IsOptional()
  @IsString()
  public vBC?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pICMS?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vICMS?: DecimalValue;

  @IsOptional()
  @IsString()
  public modBCST?: string;

  @IsOptional()
  @IsDecimal()
  public vBCST?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pICMSST?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vICMSST?: DecimalValue;
}

export class ICMS20 implements IICMS20 {
  @IsString()
  public orig!: string;

  @IsString()
  public CST!: string;

  @IsOptional()
  @IsString()
  public modBC?: string;

  @IsOptional()
  @IsString()
  public pRedBC?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vBC?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pICMS?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vICMS?: DecimalValue;
}

export class ICMS30 implements IICMS30 {
  @IsString()
  public orig!: string;

  @IsString()
  public CST!: string;

  @IsOptional()
  @IsString()
  public modBCST?: string;

  @IsOptional()
  @IsDecimal()
  public vBCST?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pICMSST?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vICMSST?: DecimalValue;
}

export class ICMS40 implements IICMS40 {
  @IsString()
  public orig!: string;

  @IsString()
  public CST!: string;

  @IsOptional()
  @IsDecimal()
  public vICMSDeson?: DecimalValue;

  @IsOptional()
  @IsString()
  public motDesICMS?: string;
}

export class ICMS51 implements IICMS51 {
  @IsString()
  public orig!: string;

  @IsString()
  public CST!: string;

  @IsOptional()
  @IsString()
  public modBC?: string;

  @IsOptional()
  @IsDecimal()
  public pRedBC?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vBC?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pICMS?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vICMS?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pDif?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vICMSDif?: DecimalValue;
}

export class ICMS60 implements IICMS60 {
  @IsString()
  public orig!: string;

  @IsString()
  public CST!: string;

  @IsOptional()
  @IsDecimal()
  public vBCSTRet?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pST?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vICMSSubstituto?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vICMSSTRet?: DecimalValue;
}

export class ICMS70 implements IICMS70 {
  @IsString()
  public orig!: string;

  @IsString()
  public CST!: string;

  @IsOptional()
  @IsString()
  public modBC?: string;

  @IsOptional()
  @IsDecimal()
  public pRedBC?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vBC?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pICMS?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vICMS?: DecimalValue;

  @IsOptional()
  @IsString()
  public modBCST?: string;

  @IsOptional()
  @IsDecimal()
  public vBCST?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pICMSST?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vICMSST?: DecimalValue;
}

export class ICMS90 implements IICMS90 {
  @IsString()
  public orig!: string;

  @IsString()
  public CST!: string;

  @IsOptional()
  @IsString()
  public modBC?: string;

  @IsOptional()
  @IsDecimal()
  public pRedBC?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vBC?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pICMS?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vICMS?: DecimalValue;

  @IsOptional()
  @IsString()
  public modBCST?: string;

  @IsOptional()
  @IsDecimal()
  public vBCST?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pICMSST?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vICMSST?: DecimalValue;
}

export class ICMSPart implements IICMSPart {
  @IsString()
  public orig!: string;

  @IsString()
  public CST!: string;

  @IsOptional()
  @IsString()
  public modBC?: string;

  @IsOptional()
  @IsDecimal()
  public vBC?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pRedBC?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pICMS?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vICMS?: DecimalValue;

  @IsOptional()
  @IsString()
  public modBCST?: string;

  @IsOptional()
  @IsDecimal()
  public pMVAST?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pRedBCST?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vBCST?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pICMSST?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vICMSST?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pBCOp?: DecimalValue;

  @IsOptional()
  @IsString()
  public UFST?: string;
}

export class ICMSST implements IICMSST {
  @IsString()
  public orig!: string;

  @IsString()
  public CST!: string;

  @IsOptional()
  @IsDecimal()
  public vBCSTRet?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pST?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vICMSSubstituto?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vICMSSTRet?: DecimalValue;
}

export class ICMSSN101 implements IICMSSN101 {
  @IsString()
  public orig!: string;

  @IsString()
  public CSOSN!: string;

  @IsOptional()
  @IsDecimal()
  public pCredSN?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vCredICMSSN?: DecimalValue;
}

export class ICMSSN102 implements IICMSSN102 {
  @IsString()
  public orig!: string;

  @IsString()
  public CSOSN!: string;
}

export class ICMSSN201 implements IICMSSN201 {
  @IsString()
  public orig!: string;

  @IsString()
  public CSOSN!: string;

  @IsOptional()
  @IsString()
  public modBCST?: string;

  @IsOptional()
  @IsDecimal()
  public vBCST?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pICMSST?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vICMSST?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pCredSN?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vCredICMSSN?: DecimalValue;
}

export class ICMSSN202 implements IICMSSN202 {
  @IsString()
  public orig!: string;

  @IsString()
  public CSOSN!: string;

  @IsOptional()
  @IsString()
  public modBCST?: string;

  @IsOptional()
  @IsDecimal()
  public vBCST?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pICMSST?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vICMSST?: DecimalValue;
}

export class ICMSSN500 implements IICMSSN500 {
  @IsString()
  public orig!: string;

  @IsString()
  public CSOSN!: string;

  @IsOptional()
  @IsDecimal()
  public vBCSTRet?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pST?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vICMSSubstituto?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vICMSSTRet?: DecimalValue;
}

export class ICMSSN900 implements IICMSSN900 {
  @IsString()
  public orig!: string;

  @IsString()
  public CSOSN!: string;

  @IsOptional()
  @IsString()
  public modBC?: string;

  @IsOptional()
  @IsDecimal()
  public vBC?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pRedBC?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pICMS?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vICMS?: DecimalValue;

  @IsOptional()
  @IsString()
  public modBCST?: string;

  @IsOptional()
  @IsDecimal()
  public vBCST?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pICMSST?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vICMSST?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pCredSN?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vCredICMSSN?: DecimalValue;
}

export class ICMS implements IICMS {
  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS00)
  @Case()
  public ICMS00?: IICMS00;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS10)
  @Case()
  public ICMS10?: IICMS10;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS20)
  @Case()
  public ICMS20?: IICMS20;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS30)
  @Case()
  public ICMS30?: IICMS30;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS40)
  @Case()
  public ICMS40?: IICMS40;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS51)
  @Case()
  public ICMS51?: IICMS51;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS60)
  @Case()
  public ICMS60?: IICMS60;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS70)
  @Case()
  public ICMS70?: IICMS70;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS90)
  @Case()
  public ICMS90?: IICMS90;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSPart)
  @Case()
  public ICMSPart?: IICMSPart;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSST)
  @Case()
  public ICMSST?: IICMSST;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSSN101)
  @Case()
  public ICMSSN101?: IICMSSN101;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSSN102)
  @Case()
  public ICMSSN102?: IICMSSN102;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSSN201)
  @Case()
  public ICMSSN201?: IICMSSN201;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSSN202)
  @Case()
  public ICMSSN202?: IICMSSN202;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSSN500)
  @Case()
  public ICMSSN500?: IICMSSN500;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSSN900)
  @Case()
  public ICMSSN900?: IICMSSN900;
}
