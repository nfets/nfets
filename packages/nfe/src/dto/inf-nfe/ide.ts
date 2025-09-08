import { IsOptional, IsString } from 'class-validator';

export class Ide {
  @IsOptional()
  @IsString()
  declare cDV?: string;

  @IsOptional()
  @IsString()
  declare cMunFG?: string;

  @IsOptional()
  @IsString()
  declare cNF?: string;

  @IsOptional()
  @IsString()
  declare cUF?: string;

  @IsOptional()
  @IsString() // TODO: talvez seja Date
  declare dhCont?: string;

  @IsOptional()
  @IsString() // TODO: talvez seja Date
  declare dhEmi?: string;

  @IsOptional()
  @IsString() // TODO: talvez seja Date
  declare dhSaiEnt?: string;

  @IsOptional()
  @IsString()
  declare finNFe?: string;

  @IsOptional()
  @IsString()
  declare idDest?: string;

  @IsOptional()
  @IsString()
  declare indFinal?: string;

  @IsOptional()
  @IsString()
  declare indIntermed?: string;

  @IsOptional()
  @IsString()
  declare indPag?: string;

  @IsOptional()
  @IsString()
  declare indPres?: string;

  @IsOptional()
  @IsString()
  declare mod?: string;

  @IsOptional()
  @IsString()
  declare nNF?: string;

  @IsOptional()
  @IsString()
  declare natOp?: string;

  @IsOptional()
  @IsString()
  declare procEmi?: string;

  @IsOptional()
  @IsString()
  declare serie?: string;

  @IsOptional()
  @IsString()
  declare tpAmb?: string;

  @IsOptional()
  @IsString()
  declare tpEmis?: string;

  @IsOptional()
  @IsString()
  declare tpImp?: string;

  @IsOptional()
  @IsString()
  declare tpNF?: string;

  @IsOptional()
  @IsString()
  declare verProc?: string;

  @IsOptional()
  @IsString()
  declare xJust?: string;
}
