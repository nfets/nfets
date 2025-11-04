import {
  UF,
  Environment,
  type EnvironmentCode,
  type StateCode,
} from '@nfets/core/domain';
import type {
  EventoPayload as IEventoPayload,
  EventoItem,
} from '@nfets/nfe/domain/entities/services/evento';
import { IsEnum, IsString, Matches, IsNotEmpty } from 'class-validator';

export class EventoPayload implements IEventoPayload {
  @IsEnum(Environment)
  public tpAmb!: EnvironmentCode;

  @IsEnum(UF)
  public cUF!: StateCode;

  @IsString()
  @Matches(/^[0-9]{1,15}$/)
  public idLote!: string;

  @IsNotEmpty()
  public evento!: EventoItem | EventoItem[];
}
