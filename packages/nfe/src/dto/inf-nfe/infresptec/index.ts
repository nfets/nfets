import { IsOptional, IsString } from 'class-validator';
import { InfRespTec as IInfRespTec } from 'src/entities/nfe/inf-nfe/infresptec';

export class InfRespTec implements IInfRespTec {
  @IsString()
  declare CNPJ: string;

  @IsString()
  declare xContato: string;

  @IsString()
  declare email: string;

  @IsString()
  declare fone: string;

  @IsOptional()
  @IsString()
  declare idCSRT?: string;

  @IsOptional()
  @IsString()
  declare hashCSRT?: string;
}
