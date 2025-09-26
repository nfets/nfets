import { IsOptional, IsString } from 'class-validator';
import { RetTransp as IRetTransp } from 'src/entities/nfe/inf-nfe/transp';

export class RetTransp implements IRetTransp {
  @IsOptional()
  @IsString()
  public vServ?: string;

  @IsOptional()
  @IsString()
  public vBCRet?: string;

  @IsOptional()
  @IsString()
  public pICMSRet?: string;

  @IsOptional()
  @IsString()
  public vICMSRet?: string;

  @IsOptional()
  @IsString()
  public CFOP?: string;

  @IsOptional()
  @IsString()
  public cMunFG?: string;
}
