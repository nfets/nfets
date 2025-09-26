import { IsOptional, IsString } from 'class-validator';
import type { AutXML as IAutXML } from 'src/entities/nfe/inf-nfe/autxml';

export class AutXML implements IAutXML {
  @IsOptional()
  @IsString()
  public CNPJ?: string;

  @IsOptional()
  @IsString()
  public CPF?: string;
}
