import { NFeTsError } from './nfets-error';

export class TransmissionError extends NFeTsError {}

export class TransmissionHostNotFoundError extends TransmissionError {}

export class TransmissionTimeoutError extends TransmissionError {}
