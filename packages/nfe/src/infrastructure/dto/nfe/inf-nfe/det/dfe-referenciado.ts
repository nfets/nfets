import { DFeReferenciado as IDFeReferenciado } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/dfe-referenciado';
import { IsOptional, IsString } from 'class-validator';

export class DFeReferenciado implements IDFeReferenciado {
  @IsString()
  public chaveAcesso!: string;

  @IsOptional()
  @IsString()
  public nItem?: string;
}
