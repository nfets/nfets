import { type TransferenciaCredito } from "./ibscbs/transf-cred";
import { type CredPresIBSZFM } from "./ibscbs/cred-pres-ibs-zfm";
import { type CredPresOper } from "./ibscbs/cred-pres-oper";
import { type EstornoCred } from "./ibscbs/estorno-credito";
import { type AjusteCompet } from "./ibscbs/ajuste-compet";
import { type IBSCBSMono } from "./ibscbs/ibscbs-mono";
import { type GIBSCBS } from "./ibscbs/gibscbs";

export interface IBSCBS {
    gTransfCred?: TransferenciaCredito;
    gCredPresIBSZFM?: CredPresIBSZFM;
    gCredPresOper?: CredPresOper;
    gAjusteCompet?: AjusteCompet;
    gEstornoCred?: EstornoCred;
    gIBSCBSMono?: IBSCBSMono;
    cClassTrib?: string;
    indDoacao?: string;
    gIBSCBS?: GIBSCBS;
    CST?: string;
}
