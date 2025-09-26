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
  @IsString() public orig!: string;
  @IsString() public CST!: string;
  @IsOptional() @IsString() public modBC?: string;
  @IsOptional() @IsString() public vBC?: string;
  @IsOptional() @IsString() public pICMS?: string;
  @IsOptional() @IsString() public vICMS?: string;
}

export class ICMS10 implements IICMS10 {
  @IsString() public orig!: string;
  @IsString() public CST!: string;
  @IsOptional() @IsString() public modBC?: string;
  @IsOptional() @IsString() public vBC?: string;
  @IsOptional() @IsString() public pICMS?: string;
  @IsOptional() @IsString() public vICMS?: string;
  @IsOptional() @IsString() public modBCST?: string;
  @IsOptional() @IsString() public vBCST?: string;
  @IsOptional() @IsString() public pICMSST?: string;
  @IsOptional() @IsString() public vICMSST?: string;
}

export class ICMS20 implements IICMS20 {
  @IsString() public orig!: string;
  @IsString() public CST!: string;
  @IsOptional() @IsString() public modBC?: string;
  @IsOptional() @IsString() public pRedBC?: string;
  @IsOptional() @IsString() public vBC?: string;
  @IsOptional() @IsString() public pICMS?: string;
  @IsOptional() @IsString() public vICMS?: string;
}

export class ICMS30 implements IICMS30 {
  @IsString() public orig!: string;
  @IsString() public CST!: string;
  @IsOptional() @IsString() public modBCST?: string;
  @IsOptional() @IsString() public vBCST?: string;
  @IsOptional() @IsString() public pICMSST?: string;
  @IsOptional() @IsString() public vICMSST?: string;
}

export class ICMS40 implements IICMS40 {
  @IsString() public orig!: string;
  @IsString() public CST!: string;
  @IsOptional() @IsString() public vICMSDeson?: string;
  @IsOptional() @IsString() public motDesICMS?: string;
}

export class ICMS51 implements IICMS51 {
  @IsString() public orig!: string;
  @IsString() public CST!: string;
  @IsOptional() @IsString() public modBC?: string;
  @IsOptional() @IsString() public pRedBC?: string;
  @IsOptional() @IsString() public vBC?: string;
  @IsOptional() @IsString() public pICMS?: string;
  @IsOptional() @IsString() public vICMS?: string;
  @IsOptional() @IsString() public pDif?: string;
  @IsOptional() @IsString() public vICMSDif?: string;
}

export class ICMS60 implements IICMS60 {
  @IsString() public orig!: string;
  @IsString() public CST!: string;
  @IsOptional() @IsString() public vBCSTRet?: string;
  @IsOptional() @IsString() public pST?: string;
  @IsOptional() @IsString() public vICMSSubstituto?: string;
  @IsOptional() @IsString() public vICMSSTRet?: string;
}

export class ICMS70 implements IICMS70 {
  @IsString() public orig!: string;
  @IsString() public CST!: string;
  @IsOptional() @IsString() public modBC?: string;
  @IsOptional() @IsString() public pRedBC?: string;
  @IsOptional() @IsString() public vBC?: string;
  @IsOptional() @IsString() public pICMS?: string;
  @IsOptional() @IsString() public vICMS?: string;
  @IsOptional() @IsString() public modBCST?: string;
  @IsOptional() @IsString() public vBCST?: string;
  @IsOptional() @IsString() public pICMSST?: string;
  @IsOptional() @IsString() public vICMSST?: string;
}

export class ICMS90 implements IICMS90 {
  @IsString() public orig!: string;
  @IsString() public CST!: string;
  @IsOptional() @IsString() public modBC?: string;
  @IsOptional() @IsString() public pRedBC?: string;
  @IsOptional() @IsString() public vBC?: string;
  @IsOptional() @IsString() public pICMS?: string;
  @IsOptional() @IsString() public vICMS?: string;
  @IsOptional() @IsString() public modBCST?: string;
  @IsOptional() @IsString() public vBCST?: string;
  @IsOptional() @IsString() public pICMSST?: string;
  @IsOptional() @IsString() public vICMSST?: string;
}

export class ICMSPart implements IICMSPart {
  @IsString() public orig!: string;
  @IsString() public CST!: string;
  @IsOptional() @IsString() public modBC?: string;
  @IsOptional() @IsString() public vBC?: string;
  @IsOptional() @IsString() public pRedBC?: string;
  @IsOptional() @IsString() public pICMS?: string;
  @IsOptional() @IsString() public vICMS?: string;
  @IsOptional() @IsString() public modBCST?: string;
  @IsOptional() @IsString() public pMVAST?: string;
  @IsOptional() @IsString() public pRedBCST?: string;
  @IsOptional() @IsString() public vBCST?: string;
  @IsOptional() @IsString() public pICMSST?: string;
  @IsOptional() @IsString() public vICMSST?: string;
  @IsOptional() @IsString() public pBCOp?: string;
  @IsOptional() @IsString() public UFST?: string;
}

export class ICMSST implements IICMSST {
  @IsString() public orig!: string;
  @IsString() public CST!: string;
  @IsOptional() @IsString() public vBCSTRet?: string;
  @IsOptional() @IsString() public pST?: string;
  @IsOptional() @IsString() public vICMSSubstituto?: string;
  @IsOptional() @IsString() public vICMSSTRet?: string;
}

export class ICMSSN101 implements IICMSSN101 {
  @IsString() public orig!: string;
  @IsString() public CSOSN!: string;
  @IsOptional() @IsString() public pCredSN?: string;
  @IsOptional() @IsString() public vCredICMSSN?: string;
}

export class ICMSSN102 implements IICMSSN102 {
  @IsString() public orig!: string;
  @IsString() public CSOSN!: string;
}

export class ICMSSN201 implements IICMSSN201 {
  @IsString() public orig!: string;
  @IsString() public CSOSN!: string;
  @IsOptional() @IsString() public modBCST?: string;
  @IsOptional() @IsString() public vBCST?: string;
  @IsOptional() @IsString() public pICMSST?: string;
  @IsOptional() @IsString() public vICMSST?: string;
  @IsOptional() @IsString() public pCredSN?: string;
  @IsOptional() @IsString() public vCredICMSSN?: string;
}

export class ICMSSN202 implements IICMSSN202 {
  @IsString() public orig!: string;
  @IsString() public CSOSN!: string;
  @IsOptional() @IsString() public modBCST?: string;
  @IsOptional() @IsString() public vBCST?: string;
  @IsOptional() @IsString() public pICMSST?: string;
  @IsOptional() @IsString() public vICMSST?: string;
}

export class ICMSSN500 implements IICMSSN500 {
  @IsString() public orig!: string;
  @IsString() public CSOSN!: string;
  @IsOptional() @IsString() public vBCSTRet?: string;
  @IsOptional() @IsString() public pST?: string;
  @IsOptional() @IsString() public vICMSSubstituto?: string;
  @IsOptional() @IsString() public vICMSSTRet?: string;
}

export class ICMSSN900 implements IICMSSN900 {
  @IsString() public orig!: string;
  @IsString() public CSOSN!: string;
  @IsOptional() @IsString() public modBC?: string;
  @IsOptional() @IsString() public vBC?: string;
  @IsOptional() @IsString() public pRedBC?: string;
  @IsOptional() @IsString() public pICMS?: string;
  @IsOptional() @IsString() public vICMS?: string;
  @IsOptional() @IsString() public modBCST?: string;
  @IsOptional() @IsString() public vBCST?: string;
  @IsOptional() @IsString() public pICMSST?: string;
  @IsOptional() @IsString() public vICMSST?: string;
  @IsOptional() @IsString() public pCredSN?: string;
  @IsOptional() @IsString() public vCredICMSSN?: string;
}

export class ICMS implements IICMS {
  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS00)
  public ICMS00?: ICMS00;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS10)
  public ICMS10?: ICMS10;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS20)
  public ICMS20?: ICMS20;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS30)
  public ICMS30?: ICMS30;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS40)
  public ICMS40?: ICMS40;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS51)
  public ICMS51?: ICMS51;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS60)
  public ICMS60?: ICMS60;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS70)
  public ICMS70?: ICMS70;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS90)
  public ICMS90?: ICMS90;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSPart)
  public ICMSPart?: ICMSPart;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSST)
  public ICMSST?: ICMSST;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSSN101)
  public ICMSSN101?: ICMSSN101;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSSN102)
  public ICMSSN102?: ICMSSN102;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSSN201)
  public ICMSSN201?: ICMSSN201;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSSN202)
  public ICMSSN202?: ICMSSN202;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSSN500)
  public ICMSSN500?: ICMSSN500;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSSN900)
  public ICMSSN900?: ICMSSN900;
}
