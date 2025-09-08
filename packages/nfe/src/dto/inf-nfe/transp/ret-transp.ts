import { IsOptional, IsString } from 'class-validator';

export class RetTransp {
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
