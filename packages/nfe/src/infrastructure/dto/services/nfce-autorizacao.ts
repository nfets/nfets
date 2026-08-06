import type { SignedEntity } from '@nfets/core/domain';
import type { AutorizacaoPayload as IAutorizacaoPayload } from '@nfets/nfe/domain/entities/services/autorizacao';
import type { NFe as INFe } from '@nfets/nfe/domain/entities/nfe/nfe';

import { NfeAutorizacaoPayload } from './nfe-autorizacao';

export class NfceAutorizacaoPayload<
  E extends INFe,
  T extends SignedEntity<E> | SignedEntity<E>[],
>
  extends NfeAutorizacaoPayload<E, T>
  implements IAutorizacaoPayload<E, T> {}
