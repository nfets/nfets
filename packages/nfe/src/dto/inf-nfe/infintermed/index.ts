import { IsOptional, IsString } from 'class-validator';
import { InfIntermed as IInfIntermed } from 'src/entities/nfe/inf-nfe/infintermed';

export class InfIntermed implements IInfIntermed {
  @IsString()
  declare CNPJ: string;

  @IsOptional()
  @IsString()
  declare idCadIntTran?: string;
}
