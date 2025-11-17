import type {
  EventoPayload as IEventoPayload,
  EventoItem as IEventoItem,
  InfEvento as IInfEvento,
  InfEventoAttributes as IInfEventoAttributes,
  EventoItemAttributes as IEventoItemAttributes,
} from '@nfets/nfe/domain/entities/services/evento';
import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsObject,
  IsOptional,
  IsEnum,
  IsNumber,
  Allow,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  Choice,
  TransformDateString,
  type Signature,
  type EnvironmentCode,
  type StateCode,
} from '@nfets/core';
import { TpEvent } from '@nfets/nfe/domain/entities/constants/tp-event';

export class InfEventoAttributes implements IInfEventoAttributes {
  @IsString()
  public Id!: string;
}

@Choice({ properties: ['CNPJ', 'CPF'], required: true })
export class InfEvento<T> implements IInfEvento<T> {
  @IsObject()
  @ValidateNested()
  @Type(() => InfEventoAttributes)
  public $!: IInfEventoAttributes;

  @IsString()
  public cOrgao!: StateCode;

  @IsString()
  public tpAmb!: EnvironmentCode;

  @IsString()
  @IsOptional()
  public CNPJ?: string;

  @IsString()
  @IsOptional()
  public CPF?: string;

  @IsString()
  public chNFe!: string;

  @TransformDateString({ format: 'YYYY-MM-DD[T]HH:mm:ssZ' })
  public dhEvento!: string;

  @IsEnum(TpEvent)
  public tpEvento!: TpEvent;

  @IsNumber()
  public nSeqEvento!: number;

  @IsString()
  public verEvento!: string;

  @IsObject()
  public detEvento!: T;
}

export class EventoItemAttributes implements IEventoItemAttributes {
  @IsString()
  public xmlns!: string;
}

export class EventoItem<T> implements IEventoItem<T> {
  @IsObject()
  @ValidateNested()
  @Type(() => EventoItemAttributes)
  public $!: IEventoItemAttributes;

  @IsObject()
  @ValidateNested()
  @Type(() => InfEvento)
  public infEvento!: InfEvento<T>;

  @Allow()
  public Signature!: Signature;
}

export class EventoPayload<T> implements IEventoPayload<T> {
  @IsString()
  public idLote!: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => EventoItem)
  public evento!: EventoItem<T>;
}
