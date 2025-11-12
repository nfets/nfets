import {
  StateCodes,
  Environment,
  type EnvironmentCode,
  type StateCode,
} from '@nfets/core/domain';
import type {
  ConsultStatusPayload as IConsultStatusPayload,
  ConsultStatusRequest as IConsultStatusRequest,
} from '@nfets/nfe/domain/entities/services/consult-status';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
  IsOptional,
} from 'class-validator';

export class ConsultStatusPayload implements IConsultStatusPayload {
  @IsEnum(Environment)
  public tpAmb!: EnvironmentCode;

  @IsEnum(StateCodes)
  public cUF!: StateCode;

  @IsOptional()
  public xServ = 'STATUS' as const;
}

export class ConsultStatusRequest implements IConsultStatusRequest {
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => ConsultStatusPayload)
  public consStatServ!: IConsultStatusPayload;
}
