import {
  StateCodes,
  Environment,
  type EnvironmentCode,
  type StateCode,
} from '@nfets/core/domain';
import { Choice } from '@nfets/core/application';
import type {
  ConsChNFe as IConsChNFe,
  DistribuicaoDFePayload as IDistribuicaoDFePayload,
} from '@nfets/nfe/domain/entities/services/distribuicao-dfe';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';

export class ConsChNFe implements IConsChNFe {
  @IsString()
  @Length(44, 44)
  @Matches(/^[A-Z0-9]{44}$/)
  public chNFe!: string;
}

@Choice<IDistribuicaoDFePayload>({
  properties: ['CNPJ', 'CPF'],
  required: true,
})
export class DistribuicaoDFePayload implements IDistribuicaoDFePayload {
  @IsEnum(Environment)
  public tpAmb!: EnvironmentCode;

  @IsEnum(StateCodes)
  public cUFAutor!: StateCode;

  @IsOptional()
  @IsString()
  public CNPJ?: string = '' as const;

  @IsOptional()
  @IsString()
  public CPF?: string = '' as const;

  @IsObject()
  @ValidateNested()
  @Type(() => ConsChNFe)
  public consChNFe!: IConsChNFe;
}
