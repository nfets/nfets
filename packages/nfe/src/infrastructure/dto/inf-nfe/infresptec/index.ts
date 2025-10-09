import { IsOptional, IsString } from 'class-validator';
import { InfRespTec as IInfRespTec } from '@nfets/nfe/domain/entities/nfe/inf-nfe/infresptec';

export class InfRespTec implements IInfRespTec {
  @IsString()
  public CNPJ!: string;

  @IsString()
  public xContato!: string;

  @IsString()
  public email!: string;

  @IsString()
  public fone!: string;

  @IsOptional()
  @IsString()
  public idCSRT?: string;

  @IsOptional()
  @IsString()
  public hashCSRT?: string;
}
