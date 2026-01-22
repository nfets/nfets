import { TribRegular } from "./trib-regular";
import { IBSMun } from "./ibs-mun";
import { IBSUF } from "./ibs-uf";
import { CBS } from "./cbs";

export interface GIBSCBS {
    gTribRegular?: TribRegular;
    gIBSMun?: IBSMun;
    gIBSUF?: IBSUF;
    vIBS: string;
    vBC: string;
    gCBS?: CBS;
}
