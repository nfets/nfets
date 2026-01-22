import { IBSCBS as IIBSCBS } from "@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs"
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { TransferenciaCredito } from "./ibscbs/transf-cred";
import { CredPresIBSZFM } from "./ibscbs/cred-pres-ibs-zfm";
import { CredPresOper } from "./ibscbs/cred-pres-oper";
import { EstornoCred } from "./ibscbs/estorno-credito";
import { AjusteCompet } from "./ibscbs/ajuste-compet";
import { IBSCBSMono } from "./ibscbs/ibscbs-mono";
import { GIBSCBS } from "./ibscbs/gibscbs";
import { Type } from "class-transformer";

export class IBSCBS implements IIBSCBS {
    @IsOptional()
    @IsString()
    public cClassTrib?: string;

    @IsOptional()
    @IsString()
    public indDoacao?: string;

    @IsOptional()
    @IsString()
    public CST?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => TransferenciaCredito)
    public gTransfCred?: TransferenciaCredito;

    @IsOptional()
    @ValidateNested()
    @Type(() => CredPresIBSZFM)
    public gCredPresIBSZFM?: CredPresIBSZFM;

    @IsOptional()
    @ValidateNested()
    @Type(() => CredPresOper)
    public gCredPresOper?: CredPresOper;

    @IsOptional()
    @ValidateNested()
    @Type(() => AjusteCompet)
    public gAjusteCompet?: AjusteCompet;

    @IsOptional()
    @ValidateNested()
    @Type(() => EstornoCred)
    public gEstornoCred?: EstornoCred;

    @IsOptional()
    @ValidateNested()
    @Type(() => IBSCBSMono)
    public gIBSCBSMono?: IBSCBSMono;

    @IsOptional()
    @ValidateNested()
    @Type(() => GIBSCBS)
    public gIBSCBS?: GIBSCBS;
}

