import type { ReadCertificateResponse } from '../certificate/certificate';
import type { Client } from './payload';

export interface TransmitterOptions {
  certificate?: ReadCertificateResponse;
  contingency?: boolean;
}

export interface Transmitter<C extends Client> {
  configure(options: TransmitterOptions): Transmitter<C>;
}
