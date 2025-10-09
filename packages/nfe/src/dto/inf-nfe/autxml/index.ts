import { IsOptional, IsString } from 'class-validator';
import { SwitchCase } from '@nfets/core/application';
import type { AutXML as IAutXML } from '@nfets/nfe/entities/nfe/inf-nfe/autxml';

export class AutXML implements IAutXML {
  @IsOptional()
  @IsString()
  @SwitchCase()
  public CNPJ?: string;

  @IsOptional()
  @IsString()
  @SwitchCase()
  public CPF?: string;
}
