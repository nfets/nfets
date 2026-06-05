import type { NFeTsError } from '../domain/errors/nfets-error';
import {
  TransmissionHostNotFoundError,
  TransmissionTimeoutError,
} from '../domain/errors/transmission-error';
import { type Left, left } from './either';
import { leftFromError } from './left-from-error';

const HOST_NOT_FOUND_CODES = new Set([
  'ENOTFOUND',
  'EAI_AGAIN',
  'EAI_FAIL',
  'EAI_NONAME',
]);

const TIMEOUT_CODES = new Set(['ETIMEDOUT', 'ESOCKETTIMEDOUT', 'ECONNABORTED']);

const hasMessage = (error: unknown): error is { message: string } =>
  !!error && typeof error === 'object' && 'message' in error;

const getCode = (error: unknown): string | undefined => {
  if (!error || typeof error !== 'object' || !('code' in error)) return void 0;
  const { code } = error;
  return typeof code === 'string' ? code : void 0;
};

const getHostname = (error: unknown): string | undefined => {
  if (!error || typeof error !== 'object' || !('hostname' in error))
    return void 0;
  const { hostname } = error;
  return typeof hostname === 'string' ? hostname : void 0;
};

const getMessage = (error: unknown): string | undefined => {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (hasMessage(error)) return error.message;
  return void 0;
};

const isTimeoutMessage = (message: string) => {
  const normalized = message.toLowerCase();
  return (
    normalized.includes('timeout') ||
    normalized.includes('timed out') ||
    normalized.includes('time-out') ||
    normalized.includes('read econnreset')
  );
};

const isHostNotFoundMessage = (message: string) =>
  /getaddrinfo\s+ENOTFOUND/i.test(message) || /\bENOTFOUND\b/i.test(message);

const collectErrorChain = (error: unknown): unknown[] => {
  const chain: unknown[] = [];
  const seen = new Set<unknown>();
  let current: unknown = error;

  while (current !== void 0 && current !== null && !seen.has(current)) {
    seen.add(current);
    chain.push(current);

    if (current instanceof AggregateError) {
      for (const nested of current.errors)
        if (!seen.has(nested)) chain.push(nested);
    }

    const next = current instanceof Error ? current.cause : void 0;
    current = next;
  }

  return chain;
};

const errorOptions = (error: unknown): ErrorOptions | undefined =>
  error instanceof Error ? { cause: error } : undefined;

export const mapTransmissionError = (error: unknown): Left<NFeTsError> => {
  const chain = collectErrorChain(error);
  const message =
    getMessage(error) ??
    chain.map(getMessage).find((item): item is string => !!item);

  for (const item of chain) {
    const code = getCode(item);
    if (code && HOST_NOT_FOUND_CODES.has(code)) {
      return left(
        new TransmissionHostNotFoundError(
          message ?? `Host not found (${getHostname(item) ?? code})`,
          errorOptions(error),
        ),
      );
    }

    if (code && TIMEOUT_CODES.has(code)) {
      return left(
        new TransmissionTimeoutError(
          message ?? 'Transmission timeout',
          errorOptions(error),
        ),
      );
    }

    const itemMessage = getMessage(item);
    if (itemMessage && isTimeoutMessage(itemMessage)) {
      return left(
        new TransmissionTimeoutError(itemMessage, errorOptions(error)),
      );
    }
  }

  if (!message) return leftFromError(error);

  if (isHostNotFoundMessage(message))
    return left(
      new TransmissionHostNotFoundError(message, errorOptions(error)),
    );

  if (isTimeoutMessage(message))
    return left(new TransmissionTimeoutError(message, errorOptions(error)));

  return leftFromError(error);
};

export const leftFromTransmissionError = (error: unknown) =>
  mapTransmissionError(error);
