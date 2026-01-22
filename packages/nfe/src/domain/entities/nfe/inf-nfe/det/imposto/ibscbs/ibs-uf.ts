import { DevTrib } from "./dev-trib";
import { Dif } from "./dif";
import { Red } from "./red";

export interface IBSUF {
    gDevTrib?: DevTrib;
    pIBSUF: string;
    vIBSUF: string;
    gDif?: Dif;
    gRed?: Red;
}