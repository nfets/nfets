import { type DevTrib } from "./dev-trib";
import { type Dif } from "./dif";
import { type Red } from "./red";

export interface CBS {
    gDevTrib?: DevTrib;
    pCBS: string;
    vCBS: string;
    gDif?: Dif;
    gRed?: Red;
}