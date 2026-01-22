import { DevTrib } from "./dev-trib";
import { Dif } from "./dif";
import { Red } from "./red";

export interface IBSMun {
    gDevTrib?: DevTrib;
    pIBSMun: string;
    vIBSMun: string;
    gDif?: Dif;
    gRed?: Red;
}