import type { SignedEntity } from '@nfets/core/domain';
import type { AutorizacaoPayload as IAutorizacaoPayload } from '@nfets/nfe/domain/entities/services/autorizacao';
import type { NFCe as INFCe } from '@nfets/nfe/domain/entities/nfe/nfce';

import { NfeAutorizacaoPayload } from './nfe-autorizacao';

export class NfceAutorizacaoPayload<
  E extends INFCe,
  T extends SignedEntity<E> | SignedEntity<E>[],
>
  extends NfeAutorizacaoPayload<E, T>
  implements IAutorizacaoPayload<E, T> {}
