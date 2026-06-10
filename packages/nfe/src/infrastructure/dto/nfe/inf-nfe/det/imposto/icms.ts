import { IsOptional, IsString, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Choice, TransformDecimal } from '@nfets/core/application';

import type { DecimalValue } from '@nfets/core/domain';
import type {
  ICMS00 as IICMS00,
  ICMS02 as IICMS02,
  ICMS10 as IICMS10,
  ICMS15 as IICMS15,
  ICMS20 as IICMS20,
  ICMS30 as IICMS30,
  ICMS40 as IICMS40,
  ICMS51 as IICMS51,
  ICMS53 as IICMS53,
  ICMS60 as IICMS60,
  ICMS61 as IICMS61,
  ICMS70 as IICMS70,
  ICMS90 as IICMS90,
} from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/icms';

import type {
  ICMSSN101 as IICMSSN101,
  ICMSSN102 as IICMSSN102,
  ICMSSN201 as IICMSSN201,
  ICMSSN202 as IICMSSN202,
  ICMSSN500 as IICMSSN500,
  ICMSSN900 as IICMSSN900,
} from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/icms';
import type { ICMSST as IICMSST } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/icms';
import type { ICMSPart as IICMSPart } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/icms';
import type { ICMS as IICMS } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/icms';

export class ICMS00 implements IICMS00 {
  @IsString()
  public orig!: string;

  @IsString()
  public CST!: string;

  @IsOptional()
  @IsString()
  public modBC?: string;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBC?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pICMS?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMS?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBCFCP?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pFCP?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vFCP?: DecimalValue;
}

export class ICMS02 implements IICMS02 {
  @IsString()
  public orig!: string;

  @IsString()
  public CST!: string;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public qBCMono?: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public adRemICMS!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vICMSMono!: DecimalValue;
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
  @TransformDecimal({ fixed: 2 })
  public vBC?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pICMS?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMS?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBCFCP?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pFCP?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vFCP?: DecimalValue;

  @IsOptional()
  @IsString()
  public modBCST?: string;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pMVAST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pRedBCST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBCST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pICMSST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBCFCPST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pFCPST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vFCPST?: DecimalValue;
}

export class ICMS15 implements IICMS15 {
  @IsString()
  public orig!: string;

  @IsString()
  public CST!: string;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public qBCMono?: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public adRemICMS!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vICMSMono!: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public qBCMonoReten?: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public adRemICMSReten!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vICMSMonoReten!: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  @Max(100)
  public pRedAdRem?: DecimalValue;

  @IsOptional()
  @IsString()
  public motRedAdRem?: string;
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
  @TransformDecimal({ fixed: 4 })
  public pRedBC?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBC?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pICMS?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMS?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBCFCP?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pFCP?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vFCP?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSDeson?: DecimalValue;

  @IsOptional()
  @IsString()
  public motDesICMS?: string;
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
  @TransformDecimal({ fixed: 4 })
  public pMVAST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pRedBCST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBCST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pICMSST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBCFCPST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pFCPST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vFCPST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSDeson?: DecimalValue;

  @IsOptional()
  @IsString()
  public motDesICMS?: string;
}

export class ICMS40 implements IICMS40 {
  @IsString()
  public orig!: string;

  @IsString()
  public CST!: string;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
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
  @TransformDecimal({ fixed: 4 })
  public pRedBC?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBC?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pICMS?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMS?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  @Max(100)
  public pDif?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSDif?: DecimalValue;
}

export class ICMS53 implements IICMS53 {
  @IsString()
  public orig!: string;

  @IsString()
  public CST!: string;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public qBCMono?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public adRemICMS?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSMonoOp?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  @Max(100)
  public pDif?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSMonoDif?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSMono?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public qBCMonoDif?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public adRemICMSDif?: DecimalValue;
}

export class ICMS60 implements IICMS60 {
  @IsString()
  public orig!: string;

  @IsString()
  public CST!: string;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBCSTRet?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSSubstituto?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSSTRet?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBCFCPSTRet?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pFCPSTRet?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vFCPSTRet?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pRedBCEfet?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBCEfet?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pICMSEfet?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSEfet?: DecimalValue;
}

export class ICMS61 implements IICMS61 {
  @IsString()
  public orig!: string;

  @IsString()
  public CST!: string;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public qBCMonoRet?: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public adRemICMSRet!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vICMSMonoRet!: DecimalValue;
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
  @TransformDecimal({ fixed: 4 })
  public pRedBC?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBC?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pICMS?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMS?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBCFCP?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pFCP?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vFCP?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSDeson?: DecimalValue;

  @IsOptional()
  @IsString()
  public motDesICMS?: string;

  @IsOptional()
  @IsString()
  public modBCST?: string;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pMVAST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pRedBCST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBCST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pICMSST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBCFCPST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pFCPST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vFCPST?: DecimalValue;
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
  @TransformDecimal({ fixed: 4 })
  public pRedBC?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBC?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pICMS?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMS?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBCFCP?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pFCP?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vFCP?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSDeson?: DecimalValue;

  @IsOptional()
  @IsString()
  public motDesICMS?: string;

  @IsOptional()
  @IsString()
  public modBCST?: string;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pMVAST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pRedBCST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBCST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pICMSST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBCFCPST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pFCPST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vFCPST?: DecimalValue;
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
  @TransformDecimal({ fixed: 2 })
  public vBC?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pRedBC?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public pICMS?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMS?: DecimalValue;

  @IsOptional()
  @IsString()
  public modBCST?: string;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pMVAST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pRedBCST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBCST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pICMSST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
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
  @TransformDecimal({ fixed: 2 })
  public vBCSTRet?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSSubstituto?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSSTRet?: DecimalValue;
}

export class ICMSSN101 implements IICMSSN101 {
  @IsString()
  public orig!: string;

  @IsString()
  public CSOSN!: string;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pCredSN?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
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
  @TransformDecimal({ fixed: 2 })
  public vBCST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pICMSST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pCredSN?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
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
  @TransformDecimal({ fixed: 2 })
  public vBCST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pICMSST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSST?: DecimalValue;
}

export class ICMSSN500 implements IICMSSN500 {
  @IsString()
  public orig!: string;

  @IsString()
  public CSOSN!: string;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBCSTRet?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSSubstituto?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
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
  @TransformDecimal({ fixed: 2 })
  public vBC?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pRedBC?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pICMS?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMS?: DecimalValue;

  @IsOptional()
  @IsString()
  public modBCST?: string;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBCST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pICMSST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pCredSN?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vCredICMSSN?: DecimalValue;
}

@Choice({
  properties: [
    'ICMS00',
    'ICMS02',
    'ICMS10',
    'ICMS15',
    'ICMS20',
    'ICMS30',
    'ICMS40',
    'ICMS51',
    'ICMS53',
    'ICMS60',
    'ICMS61',
    'ICMS70',
    'ICMS90',
    'ICMSPart',
    'ICMSST',
    'ICMSSN101',
    'ICMSSN102',
    'ICMSSN201',
    'ICMSSN202',
    'ICMSSN500',
    'ICMSSN900',
  ],
})
export class ICMS implements IICMS {
  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS00)
  public ICMS00?: IICMS00;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS02)
  public ICMS02?: IICMS02;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS10)
  public ICMS10?: IICMS10;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS15)
  public ICMS15?: IICMS15;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS20)
  public ICMS20?: IICMS20;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS30)
  public ICMS30?: IICMS30;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS40)
  public ICMS40?: IICMS40;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS51)
  public ICMS51?: IICMS51;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS53)
  public ICMS53?: IICMS53;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS60)
  public ICMS60?: IICMS60;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS61)
  public ICMS61?: IICMS61;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS70)
  public ICMS70?: IICMS70;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS90)
  public ICMS90?: IICMS90;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSPart)
  public ICMSPart?: IICMSPart;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSST)
  public ICMSST?: IICMSST;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSSN101)
  public ICMSSN101?: IICMSSN101;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSSN102)
  public ICMSSN102?: IICMSSN102;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSSN201)
  public ICMSSN201?: IICMSSN201;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSSN202)
  public ICMSSN202?: IICMSSN202;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSSN500)
  public ICMSSN500?: IICMSSN500;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSSN900)
  public ICMSSN900?: IICMSSN900;
}
