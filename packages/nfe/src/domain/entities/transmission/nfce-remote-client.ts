import type { Either } from '@nfets/core';
import type {
  NFeTsError,
  ReadCertificateResponse,
  RequestConfig,
  SignedEntity,
  Transmitter,
} from '@nfets/core/domain';

import type {
  NfeRemoteClient,
  NfeTransmitter,
  NfeTransmitterOptions,
} from './nfe-remote-client';
import type {
  AutorizacaoPayload,
  AutorizacaoRequest,
  AutorizacaoResponse,
} from '../services/autorizacao';
import type { NFCe } from '../nfe/nfce';

export interface NfceQrcodeOptionsBase {
  version: '200' | '300';
  urlService: string;
  urlConsult: string;
}

export interface NfceQrcodeOptions200 {
  CSC: string;
  CSCId: string;
  version?: '200';
}

export interface NfceQrcodeOptions300 {
  version?: '300';
  certificate: ReadCertificateResponse;
}

export type NfceQrcodeOptions = NfceQrcodeOptions200 | NfceQrcodeOptions300;

export interface NfceTransmitterOptions extends NfeTransmitterOptions {
  qrCode: NfceQrcodeOptions200 | { version: '300' };
}

export interface NfceTransmitter
  extends NfeTransmitter,
    Transmitter<NfceRemoteClient> {
  configure(options: NfceTransmitterOptions): this;
  autorizacao<E extends NFCe, T extends SignedEntity<E> | SignedEntity<E>[]>(
    payload: AutorizacaoPayload<E, T>,
  ): Promise<Either<NFeTsError, AutorizacaoResponse>>;
}

export interface NfceRemoteClient extends NfeRemoteClient {
  nfeAutorizacaoLote<
    E extends NFCe,
    T extends SignedEntity<E> | SignedEntity<E>[],
  >(
    args: AutorizacaoRequest<E, T>,
    opt?: RequestConfig,
  ): Promise<AutorizacaoResponse>;
}
