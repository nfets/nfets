import { DevTrib as IDevTrib } from "@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/dev-trib"
import { IsString } from "class-validator";

export class DevTrib implements IDevTrib {
    @IsString()
    public vDevTrib!: string
}