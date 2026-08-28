import type { ReadCertificateRequest } from '@nfets/core/domain';
import { left, NFeTsError, right, type Either } from '@nfets/core';
import { Pipeline } from '../pipeline';
import { NfeRemoteTransmitter } from '../../transmission/nfe-transmitter';

export interface IssuerIdentification {
  CNPJ?: string;
  CPF?: string;
  idDigits: string;
}

export abstract class TransmissionPipeline extends Pipeline {
  protected readonly transmitter = new NfeRemoteTransmitter(this.soap);

  public constructor(protected readonly certificate: ReadCertificateRequest) {
    super(certificate);
  }

  protected issuerFromIdentification(
    identification: string,
  ): Either<NFeTsError, IssuerIdentification> {
    const value = identification.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!value)
      return left(new NFeTsError('CNPJ/CPF do emitente é obrigatório'));

    if (value.length === 11)
      return right({
        CPF: value,
        idDigits: value.padStart(14, '0'),
      });

    const CNPJ = value.padStart(14, '0');
    if (CNPJ.length !== 14)
      return left(new NFeTsError('CNPJ/CPF do emitente é inválido'));

    return right({ CNPJ, idDigits: CNPJ });
  }
}
