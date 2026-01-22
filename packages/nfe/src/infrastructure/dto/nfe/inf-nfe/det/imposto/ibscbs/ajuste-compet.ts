import { AjusteCompet as IAjusteCompet } from "@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/ajuste-compet"
import { IsString } from "class-validator";

export class AjusteCompet implements IAjusteCompet {
    @IsString()
    public competApur!: string;

    @IsString()
    public vCBS!: string;

    @IsString()
    public vIBS!: string;
}
