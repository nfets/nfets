import {
  type Defensivo as IDefensivo,
  type GuiaTransito as IGuiaTransito,
  type Agropecuario as IAgropecuario,
} from '@nfets/nfe/domain/entities/nfe/inf-nfe/agropecuario';
import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Choice } from '@nfets/core/application';

export class Defensivo implements IDefensivo {
  @IsString()
  public nReceituario!: string;

  @IsString()
  public CPFRespTec!: string;
}

export class GuiaTransito implements IGuiaTransito {
  @IsString()
  public tpGuia!: string;

  @IsString()
  public UFGuia!: string;

  @IsOptional()
  @IsString()
  public serieGuia?: string;

  @IsString()
  public nGuia!: string;
}

@Choice<IAgropecuario>({ properties: ['defensivo', 'guiaTransito'] })
export class Agropecuario implements IAgropecuario {
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => Defensivo)
  public defensivo?: IDefensivo[];

  @IsOptional()
  @ValidateNested()
  @Type(() => GuiaTransito)
  public guiaTransito?: IGuiaTransito;
}
