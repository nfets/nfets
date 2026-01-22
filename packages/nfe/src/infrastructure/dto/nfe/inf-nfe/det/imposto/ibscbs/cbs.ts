import { CBS as ICBS } from "@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/cbs"
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { DevTrib } from "./dev-trib";
import { Dif } from "./dif";
import { Red } from "./red";

export class CBS implements ICBS {
    @IsString()
    public pCBS!: string;

    @IsString()
    public vCBS!: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => DevTrib)
    public gDevTrib?: DevTrib;

    @IsOptional()
    @ValidateNested()
    @Type(() => Dif)
    public gDif?: Dif;

    @IsOptional()
    @ValidateNested()
    @Type(() => Red)
    public gRed?: Red;
}