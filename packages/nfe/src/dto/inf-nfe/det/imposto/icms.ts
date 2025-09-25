import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import type { ICMS as IICMS } from 'src/entities/nfe/inf-nfe/det/imposto/icms';
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

export class ICMS00 implements IICMS00 {
  @IsString() declare orig: string;
  @IsString() declare CST: string;
  @IsOptional() @IsString() declare modBC?: string;
  @IsOptional() @IsString() declare vBC?: string;
  @IsOptional() @IsString() declare pICMS?: string;
  @IsOptional() @IsString() declare vICMS?: string;
}

export class ICMS10 implements IICMS10 {
  @IsString() declare orig: string;
  @IsString() declare CST: string;
  @IsOptional() @IsString() declare modBC?: string;
  @IsOptional() @IsString() declare vBC?: string;
  @IsOptional() @IsString() declare pICMS?: string;
  @IsOptional() @IsString() declare vICMS?: string;
  @IsOptional() @IsString() declare modBCST?: string;
  @IsOptional() @IsString() declare vBCST?: string;
  @IsOptional() @IsString() declare pICMSST?: string;
  @IsOptional() @IsString() declare vICMSST?: string;
}

export class ICMS20 implements IICMS20 {
  @IsString() declare orig: string;
  @IsString() declare CST: string;
  @IsOptional() @IsString() declare modBC?: string;
  @IsOptional() @IsString() declare pRedBC?: string;
  @IsOptional() @IsString() declare vBC?: string;
  @IsOptional() @IsString() declare pICMS?: string;
  @IsOptional() @IsString() declare vICMS?: string;
}

export class ICMS30 implements IICMS30 {
  @IsString() declare orig: string;
  @IsString() declare CST: string;
  @IsOptional() @IsString() declare modBCST?: string;
  @IsOptional() @IsString() declare vBCST?: string;
  @IsOptional() @IsString() declare pICMSST?: string;
  @IsOptional() @IsString() declare vICMSST?: string;
}

export class ICMS40 implements IICMS40 {
  @IsString() declare orig: string;
  @IsString() declare CST: string;
  @IsOptional() @IsString() declare vICMSDeson?: string;
  @IsOptional() @IsString() declare motDesICMS?: string;
}

export class ICMS51 implements IICMS51 {
  @IsString() declare orig: string;
  @IsString() declare CST: string;
  @IsOptional() @IsString() declare modBC?: string;
  @IsOptional() @IsString() declare pRedBC?: string;
  @IsOptional() @IsString() declare vBC?: string;
  @IsOptional() @IsString() declare pICMS?: string;
  @IsOptional() @IsString() declare vICMS?: string;
  @IsOptional() @IsString() declare pDif?: string;
  @IsOptional() @IsString() declare vICMSDif?: string;
}

export class ICMS60 implements IICMS60 {
  @IsString() declare orig: string;
  @IsString() declare CST: string;
  @IsOptional() @IsString() declare vBCSTRet?: string;
  @IsOptional() @IsString() declare pST?: string;
  @IsOptional() @IsString() declare vICMSSubstituto?: string;
  @IsOptional() @IsString() declare vICMSSTRet?: string;
}

export class ICMS70 implements IICMS70 {
  @IsString() declare orig: string;
  @IsString() declare CST: string;
  @IsOptional() @IsString() declare modBC?: string;
  @IsOptional() @IsString() declare pRedBC?: string;
  @IsOptional() @IsString() declare vBC?: string;
  @IsOptional() @IsString() declare pICMS?: string;
  @IsOptional() @IsString() declare vICMS?: string;
  @IsOptional() @IsString() declare modBCST?: string;
  @IsOptional() @IsString() declare vBCST?: string;
  @IsOptional() @IsString() declare pICMSST?: string;
  @IsOptional() @IsString() declare vICMSST?: string;
}

export class ICMS90 implements IICMS90 {
  @IsString() declare orig: string;
  @IsString() declare CST: string;
  @IsOptional() @IsString() declare modBC?: string;
  @IsOptional() @IsString() declare pRedBC?: string;
  @IsOptional() @IsString() declare vBC?: string;
  @IsOptional() @IsString() declare pICMS?: string;
  @IsOptional() @IsString() declare vICMS?: string;
  @IsOptional() @IsString() declare modBCST?: string;
  @IsOptional() @IsString() declare vBCST?: string;
  @IsOptional() @IsString() declare pICMSST?: string;
  @IsOptional() @IsString() declare vICMSST?: string;
}

export class ICMSPart implements IICMSPart {
  @IsString() declare orig: string;
  @IsString() declare CST: string;
  @IsOptional() @IsString() declare modBC?: string;
  @IsOptional() @IsString() declare vBC?: string;
  @IsOptional() @IsString() declare pRedBC?: string;
  @IsOptional() @IsString() declare pICMS?: string;
  @IsOptional() @IsString() declare vICMS?: string;
  @IsOptional() @IsString() declare modBCST?: string;
  @IsOptional() @IsString() declare pMVAST?: string;
  @IsOptional() @IsString() declare pRedBCST?: string;
  @IsOptional() @IsString() declare vBCST?: string;
  @IsOptional() @IsString() declare pICMSST?: string;
  @IsOptional() @IsString() declare vICMSST?: string;
  @IsOptional() @IsString() declare pBCOp?: string;
  @IsOptional() @IsString() declare UFST?: string;
}

export class ICMSST implements IICMSST {
  @IsString() declare orig: string;
  @IsString() declare CST: string;
  @IsOptional() @IsString() declare vBCSTRet?: string;
  @IsOptional() @IsString() declare pST?: string;
  @IsOptional() @IsString() declare vICMSSubstituto?: string;
  @IsOptional() @IsString() declare vICMSSTRet?: string;
}

export class ICMSSN101 implements IICMSSN101 {
  @IsString() declare orig: string;
  @IsString() declare CSOSN: string;
  @IsOptional() @IsString() declare pCredSN?: string;
  @IsOptional() @IsString() declare vCredICMSSN?: string;
}

export class ICMSSN102 implements IICMSSN102 {
  @IsString() declare orig: string;
  @IsString() declare CSOSN: string;
}

export class ICMSSN201 implements IICMSSN201 {
  @IsString() declare orig: string;
  @IsString() declare CSOSN: string;
  @IsOptional() @IsString() declare modBCST?: string;
  @IsOptional() @IsString() declare vBCST?: string;
  @IsOptional() @IsString() declare pICMSST?: string;
  @IsOptional() @IsString() declare vICMSST?: string;
  @IsOptional() @IsString() declare pCredSN?: string;
  @IsOptional() @IsString() declare vCredICMSSN?: string;
}

export class ICMSSN202 implements IICMSSN202 {
  @IsString() declare orig: string;
  @IsString() declare CSOSN: string;
  @IsOptional() @IsString() declare modBCST?: string;
  @IsOptional() @IsString() declare vBCST?: string;
  @IsOptional() @IsString() declare pICMSST?: string;
  @IsOptional() @IsString() declare vICMSST?: string;
}

export class ICMSSN500 implements IICMSSN500 {
  @IsString() declare orig: string;
  @IsString() declare CSOSN: string;
  @IsOptional() @IsString() declare vBCSTRet?: string;
  @IsOptional() @IsString() declare pST?: string;
  @IsOptional() @IsString() declare vICMSSubstituto?: string;
  @IsOptional() @IsString() declare vICMSSTRet?: string;
}

export class ICMSSN900 implements IICMSSN900 {
  @IsString() declare orig: string;
  @IsString() declare CSOSN: string;
  @IsOptional() @IsString() declare modBC?: string;
  @IsOptional() @IsString() declare vBC?: string;
  @IsOptional() @IsString() declare pRedBC?: string;
  @IsOptional() @IsString() declare pICMS?: string;
  @IsOptional() @IsString() declare vICMS?: string;
  @IsOptional() @IsString() declare modBCST?: string;
  @IsOptional() @IsString() declare vBCST?: string;
  @IsOptional() @IsString() declare pICMSST?: string;
  @IsOptional() @IsString() declare vICMSST?: string;
  @IsOptional() @IsString() declare pCredSN?: string;
  @IsOptional() @IsString() declare vCredICMSSN?: string;
}

export class ICMS implements IICMS {
  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS00)
  declare ICMS00?: ICMS00;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS10)
  declare ICMS10?: ICMS10;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS20)
  declare ICMS20?: ICMS20;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS30)
  declare ICMS30?: ICMS30;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS40)
  declare ICMS40?: ICMS40;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS51)
  declare ICMS51?: ICMS51;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS60)
  declare ICMS60?: ICMS60;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS70)
  declare ICMS70?: ICMS70;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS90)
  declare ICMS90?: ICMS90;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSPart)
  declare ICMSPart?: ICMSPart;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSST)
  declare ICMSST?: ICMSST;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSSN101)
  declare ICMSSN101?: ICMSSN101;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSSN102)
  declare ICMSSN102?: ICMSSN102;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSSN201)
  declare ICMSSN201?: ICMSSN201;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSSN202)
  declare ICMSSN202?: ICMSSN202;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSSN500)
  declare ICMSSN500?: ICMSSN500;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSSN900)
  declare ICMSSN900?: ICMSSN900;
}
