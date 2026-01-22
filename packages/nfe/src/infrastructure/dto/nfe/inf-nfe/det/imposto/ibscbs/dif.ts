import { Dif as IDif } from "@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/dif"
import { IsString } from "class-validator";

export class Dif implements IDif {
    @IsString()
    public pDif!: string;

    @IsString()
    public vDif!: string;
}