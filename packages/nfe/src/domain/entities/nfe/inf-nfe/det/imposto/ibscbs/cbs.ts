import { DevTrib } from "./dev-trib";
import { Dif } from "./dif";
import { Red } from "./red";

export interface CBS {
    gDevTrib?: DevTrib;
    pCBS: string;
    vCBS: string;
    gDif?: Dif;
    gRed?: Red;
}