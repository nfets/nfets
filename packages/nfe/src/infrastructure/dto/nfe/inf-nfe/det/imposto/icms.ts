import { IsOptional, IsString, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Choice, TransformDecimal } from '@nfets/core/application';

import type { DecimalValue } from '@nfets/core/domain';
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
  @TransformDecimal({ fixed: 2 })
  public vBC?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pICMS?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
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
  @TransformDecimal({ fixed: 2 })
  public vBCST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pICMSST?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSST?: DecimalValue;
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
    'ICMS10',
    'ICMS20',
    'ICMS30',
    'ICMS40',
    'ICMS51',
    'ICMS60',
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
  @Type(() => ICMS10)
  public ICMS10?: IICMS10;

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
  @Type(() => ICMS60)
  public ICMS60?: IICMS60;

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
