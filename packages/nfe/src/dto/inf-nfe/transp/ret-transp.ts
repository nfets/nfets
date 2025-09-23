import { IsOptional, IsString } from 'class-validator';
import { RetTransp as IRetTransp } from 'src/entities/nfe/inf-nfe/transp';

export class RetTransp implements IRetTransp {
  @IsOptional()
  @IsString()
  declare vServ?: string;

  @IsOptional()
  @IsString()
  declare vBCRet?: string;

  @IsOptional()
  @IsString()
  declare pICMSRet?: string;

  @IsOptional()
  @IsString()
  declare vICMSRet?: string;

  @IsOptional()
  @IsString()
  declare CFOP?: string;

  @IsOptional()
  @IsString()
  declare cMunFG?: string;
}
