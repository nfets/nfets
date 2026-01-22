import { type TribRegular } from "./trib-regular";
import { type IBSMun } from "./ibs-mun";
import { type IBSUF } from "./ibs-uf";
import { type CBS } from "./cbs";

export interface GIBSCBS {
    gTribRegular?: TribRegular;
    gIBSMun?: IBSMun;
    gIBSUF?: IBSUF;
    vIBS: string;
    vBC: string;
    gCBS?: CBS;
}
