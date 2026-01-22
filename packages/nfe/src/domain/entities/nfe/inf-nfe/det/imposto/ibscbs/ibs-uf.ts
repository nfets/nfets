import { type DevTrib } from "./dev-trib";
import { type Dif } from "./dif";
import { type Red } from "./red";

export interface IBSUF {
    gDevTrib?: DevTrib;
    pIBSUF: string;
    vIBSUF: string;
    gDif?: Dif;
    gRed?: Red;
}