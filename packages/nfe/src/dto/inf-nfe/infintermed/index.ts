import { IsDefined, IsOptional, IsString } from 'class-validator';
import { InfIntermed as IInfIntermed } from 'src/entities/nfe/inf-nfe/infintermed';

export class InfIntermed implements IInfIntermed {
  @IsDefined()
  @IsString()
  declare CNPJ: string;

  @IsOptional()
  @IsString()
  declare idCadIntTran?: string;
}
