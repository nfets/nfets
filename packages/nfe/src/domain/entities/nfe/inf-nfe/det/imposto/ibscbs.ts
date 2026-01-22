import { TransferenciaCredito } from "./ibscbs/transf-cred";
import { CredPresIBSZFM } from "./ibscbs/cred-pres-ibs-zfm";
import { CredPresOper } from "./ibscbs/cred-pres-oper";
import { EstornoCred } from "./ibscbs/estorno-credito";
import { AjusteCompet } from "./ibscbs/ajuste-compet";
import { IBSCBSMono } from "./ibscbs/ibscbs-mono";
import { GIBSCBS } from "./ibscbs/gibscbs";

export interface IBSCBS {
    gTransfCred?: TransferenciaCredito
    gCredPresIBSZFM?: CredPresIBSZFM
    gCredPresOper?: CredPresOper;
    gAjusteCompet?: AjusteCompet;
    gEstornoCred?: EstornoCred;
    gIBSCBSMono?: IBSCBSMono;
    cClassTrib?: string;
    indDoacao?: string;
    gIBSCBS?: GIBSCBS
    CST?: string;
}

