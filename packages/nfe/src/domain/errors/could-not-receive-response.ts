import { NFeTsError } from '@nfets/core/domain';

export class CouldNotReceiveResponseError extends NFeTsError {
  constructor(
    message = 'Falha ao consultar protocolo de autorização após 3 tentativas, tente novamente mais tarde.',
  ) {
    super(message);
  }
}
