import { TribRegular as ITribRegular } from "@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/trib-regular"
import { IsString } from "class-validator";

export class TribRegular implements ITribRegular {
    @IsString()
    public CSTReg!: string;

    @IsString()
    public cClassTribReg!: string;

    @IsString()
    public pAliqEfetRegIBSUF!: string;

    @IsString()
    public vTribRegIBSUF!: string;

    @IsString()
    public pAliqEfetRegIBSMun!: string;

    @IsString()
    public vTribRegIBSMun!: string;

    @IsString()
    public pAliqEfetRegCBS!: string;

    @IsString()
    public vTribRegCBS!: string;
}