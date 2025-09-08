import {
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ICMS00 {
  @IsDefined() @IsString() declare orig: string;
  @IsDefined() @IsString() declare CST: string;
  @IsOptional() @IsString() declare modBC?: string;
  @IsOptional() @IsString() declare vBC?: string;
  @IsOptional() @IsString() declare pICMS?: string;
  @IsOptional() @IsString() declare vICMS?: string;
}

export class ICMS10 {
  @IsDefined() @IsString() declare orig: string;
  @IsDefined() @IsString() declare CST: string;
  @IsOptional() @IsString() declare modBC?: string;
  @IsOptional() @IsString() declare vBC?: string;
  @IsOptional() @IsString() declare pICMS?: string;
  @IsOptional() @IsString() declare vICMS?: string;
  @IsOptional() @IsString() declare modBCST?: string;
  @IsOptional() @IsString() declare vBCST?: string;
  @IsOptional() @IsString() declare pICMSST?: string;
  @IsOptional() @IsString() declare vICMSST?: string;
}

export class ICMS20 {
  @IsDefined() @IsString() declare orig: string;
  @IsDefined() @IsString() declare CST: string;
  @IsOptional() @IsString() declare modBC?: string;
  @IsOptional() @IsString() declare pRedBC?: string;
  @IsOptional() @IsString() declare vBC?: string;
  @IsOptional() @IsString() declare pICMS?: string;
  @IsOptional() @IsString() declare vICMS?: string;
}

export class ICMS30 {
  @IsDefined() @IsString() declare orig: string;
  @IsDefined() @IsString() declare CST: string;
  @IsOptional() @IsString() declare modBCST?: string;
  @IsOptional() @IsString() declare vBCST?: string;
  @IsOptional() @IsString() declare pICMSST?: string;
  @IsOptional() @IsString() declare vICMSST?: string;
}

export class ICMS40 {
  @IsDefined() @IsString() declare orig: string;
  @IsDefined() @IsString() declare CST: string;
  @IsOptional() @IsString() declare vICMSDeson?: string;
  @IsOptional() @IsString() declare motDesICMS?: string;
}

export class ICMS51 {
  @IsDefined() @IsString() declare orig: string;
  @IsDefined() @IsString() declare CST: string;
  @IsOptional() @IsString() declare modBC?: string;
  @IsOptional() @IsString() declare pRedBC?: string;
  @IsOptional() @IsString() declare vBC?: string;
  @IsOptional() @IsString() declare pICMS?: string;
  @IsOptional() @IsString() declare vICMS?: string;
  @IsOptional() @IsString() declare pDif?: string;
  @IsOptional() @IsString() declare vICMSDif?: string;
}

export class ICMS60 {
  @IsDefined() @IsString() declare orig: string;
  @IsDefined() @IsString() declare CST: string;
  @IsOptional() @IsString() declare vBCSTRet?: string;
  @IsOptional() @IsString() declare pST?: string;
  @IsOptional() @IsString() declare vICMSSubstituto?: string;
  @IsOptional() @IsString() declare vICMSSTRet?: string;
}

export class ICMS70 {
  @IsDefined() @IsString() declare orig: string;
  @IsDefined() @IsString() declare CST: string;
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

export class ICMS90 {
  @IsDefined() @IsString() declare orig: string;
  @IsDefined() @IsString() declare CST: string;
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

export class ICMSPart {
  @IsDefined() @IsString() declare orig: string;
  @IsDefined() @IsString() declare CST: string;
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

export class ICMSST {
  @IsDefined() @IsString() declare orig: string;
  @IsDefined() @IsString() declare CST: string;
  @IsOptional() @IsString() declare vBCSTRet?: string;
  @IsOptional() @IsString() declare pST?: string;
  @IsOptional() @IsString() declare vICMSSubstituto?: string;
  @IsOptional() @IsString() declare vICMSSTRet?: string;
}

export class ICMSSN101 {
  @IsDefined() @IsString() declare orig: string;
  @IsDefined() @IsString() declare CSOSN: string;
  @IsOptional() @IsString() declare pCredSN?: string;
  @IsOptional() @IsString() declare vCredICMSSN?: string;
}

export class ICMSSN102 {
  @IsDefined() @IsString() declare orig: string;
  @IsDefined() @IsString() declare CSOSN: string;
}

export class ICMSSN201 {
  @IsDefined() @IsString() declare orig: string;
  @IsDefined() @IsString() declare CSOSN: string;
  @IsOptional() @IsString() declare modBCST?: string;
  @IsOptional() @IsString() declare vBCST?: string;
  @IsOptional() @IsString() declare pICMSST?: string;
  @IsOptional() @IsString() declare vICMSST?: string;
  @IsOptional() @IsString() declare pCredSN?: string;
  @IsOptional() @IsString() declare vCredICMSSN?: string;
}

export class ICMSSN202 {
  @IsDefined() @IsString() declare orig: string;
  @IsDefined() @IsString() declare CSOSN: string;
  @IsOptional() @IsString() declare modBCST?: string;
  @IsOptional() @IsString() declare vBCST?: string;
  @IsOptional() @IsString() declare pICMSST?: string;
  @IsOptional() @IsString() declare vICMSST?: string;
}

export class ICMSSN500 {
  @IsDefined() @IsString() declare orig: string;
  @IsDefined() @IsString() declare CSOSN: string;
  @IsOptional() @IsString() declare vBCSTRet?: string;
  @IsOptional() @IsString() declare pST?: string;
  @IsOptional() @IsString() declare vICMSSubstituto?: string;
  @IsOptional() @IsString() declare vICMSSTRet?: string;
}

export class ICMSSN900 {
  @IsDefined() @IsString() declare orig: string;
  @IsDefined() @IsString() declare CSOSN: string;
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

export class ICMS {
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
