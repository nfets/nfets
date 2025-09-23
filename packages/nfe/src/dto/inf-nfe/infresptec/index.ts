import { IsDefined, IsOptional, IsString } from 'class-validator';
import { InfRespTec as IInfRespTec } from 'src/entities/nfe/inf-nfe/infresptec';

export class InfRespTec implements IInfRespTec {
  @IsDefined()
  @IsString()
  declare CNPJ: string;

  @IsDefined()
  @IsString()
  declare xContato: string;

  @IsDefined()
  @IsString()
  declare email: string;

  @IsDefined()
  @IsString()
  declare fone: string;

  @IsOptional()
  @IsString()
  declare idCSRT?: string;

  @IsOptional()
  @IsString()
  declare hashCSRT?: string;
}
