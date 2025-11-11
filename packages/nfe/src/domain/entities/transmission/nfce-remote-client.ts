import type { ReadCertificateResponse, Transmitter } from '@nfets/core/domain';

import type {
  NfeRemoteClient,
  NfeTransmitter,
  NfeTransmitterOptions,
} from './nfe-remote-client';

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
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface NfceRemoteClient extends NfeRemoteClient {}
