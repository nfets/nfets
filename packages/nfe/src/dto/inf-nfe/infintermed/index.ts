import { IsOptional, IsString } from 'class-validator';
import { InfIntermed as IInfIntermed } from '@nfets/nfe/entities/nfe/inf-nfe/infintermed';

export class InfIntermed implements IInfIntermed {
  @IsString()
  public CNPJ!: string;

  @IsOptional()
  @IsString()
  public idCadIntTran?: string;
}
