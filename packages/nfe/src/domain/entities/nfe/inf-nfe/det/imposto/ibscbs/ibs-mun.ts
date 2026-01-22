import { type DevTrib } from "./dev-trib";
import { type Dif } from "./dif";
import { type Red } from "./red";

export interface IBSMun {
    gDevTrib?: DevTrib;
    pIBSMun: string;
    vIBSMun: string;
    gDif?: Dif;
    gRed?: Red;
}