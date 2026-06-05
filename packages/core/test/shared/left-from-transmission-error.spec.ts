import {
  mapTransmissionError,
  leftFromTransmissionError,
} from '@nfets/core/shared/left-from-transmission-error';
import { NFeTsError } from '@nfets/core/domain/errors/nfets-error';
import {
  TransmissionError,
  TransmissionHostNotFoundError,
  TransmissionTimeoutError,
} from '@nfets/core/domain/errors/transmission-error';
import { expectIsLeft } from '@nfets/test/expects';

describe('mapTransmissionError (unit)', () => {
  it('should map getaddrinfo ENOTFOUND to TransmissionHostNotFoundError', () => {
    const error = Object.assign(
      new Error('getaddrinfo ENOTFOUND nfce-homologacao.svrs.rs.gov.br'),
      {
        code: 'ENOTFOUND',
        errno: -3008,
        syscall: 'getaddrinfo',
        hostname: 'nfce-homologacao.svrs.rs.gov.br',
      },
    );

    const mapped = mapTransmissionError(error);

    expectIsLeft(mapped);
    const result = mapped.value;
    expect(result).toBeInstanceOf(TransmissionHostNotFoundError);
    expect(result).toBeInstanceOf(TransmissionError);
    expect(result.message).toBe(
      'getaddrinfo ENOTFOUND nfce-homologacao.svrs.rs.gov.br',
    );
    expect(result.cause).toBe(error);
  });

  it('should map ENOTFOUND by code in error chain', () => {
    const root = new Error('SOAP request failed');
    const dns = Object.assign(new Error('getaddrinfo ENOTFOUND host.example'), {
      code: 'ENOTFOUND',
    });
    root.cause = dns;

    const mapped = mapTransmissionError(root);
    expectIsLeft(mapped);
    const result = mapped.value;
    expect(result).toBeInstanceOf(TransmissionHostNotFoundError);
    expect(result.cause).toBe(root);
  });

  it('should map ETIMEDOUT to TransmissionTimeoutError', () => {
    const error = Object.assign(new Error('connect ETIMEDOUT'), {
      code: 'ETIMEDOUT',
    });

    const mapped = mapTransmissionError(error);
    expectIsLeft(mapped);
    const result = mapped.value;

    expect(result).toBeInstanceOf(TransmissionTimeoutError);
    expect(result).toBeInstanceOf(TransmissionError);
    expect(result.cause).toBe(error);
  });

  it('should map ECONNABORTED (axios timeout) to TransmissionTimeoutError', () => {
    const error = Object.assign(new Error('timeout of 30000ms exceeded'), {
      code: 'ECONNABORTED',
    });

    const mapped = mapTransmissionError(error);
    expectIsLeft(mapped);
    const result = mapped.value;
    expect(result).toBeInstanceOf(TransmissionTimeoutError);
  });

  it('should map timeout message from soap to TransmissionTimeoutError', () => {
    const error = new Error('Request timed out after 30000ms');

    const mapped = mapTransmissionError(error);

    expectIsLeft(mapped);
    const result = mapped.value;
    expect(result).toBeInstanceOf(TransmissionTimeoutError);
    expect(result.message).toBe('Request timed out after 30000ms');
  });

  it('should map soap communication timeout message to TransmissionTimeoutError', () => {
    const message =
      'Erro de comunicação via soap,  Operation timed out after 40002 milliseconds with 0 bytes received ';
    const error = new Error(message);

    const mapped = mapTransmissionError(error);
    expectIsLeft(mapped);
    const result = mapped.value;

    expect(result).toBeInstanceOf(TransmissionTimeoutError);
    expect(result).toBeInstanceOf(TransmissionError);
    expect(result.message).toBe(message);
    expect(result.cause).toBe(error);
  });

  it('should map ESOCKETTIMEDOUT to TransmissionTimeoutError', () => {
    const error = Object.assign(new Error('ESOCKETTIMEDOUT'), {
      code: 'ESOCKETTIMEDOUT',
    });

    const mapped = mapTransmissionError(error);
    expectIsLeft(mapped);
    const result = mapped.value;
    expect(result).toBeInstanceOf(TransmissionTimeoutError);
  });

  it('should map node tls read ECONNRESET system error to TransmissionTimeoutError', () => {
    const error = Object.assign(new Error('read ECONNRESET'), {
      errno: -54,
      code: 'ECONNRESET',
      syscall: 'read',
    });

    const mapped = leftFromTransmissionError(error);
    expectIsLeft(mapped);
    const result = mapped.value;

    expect(result).toBeInstanceOf(TransmissionTimeoutError);
    expect(result).toBeInstanceOf(TransmissionError);
    expect(result).not.toBeInstanceOf(TransmissionHostNotFoundError);
    expect(result.constructor).toBe(TransmissionTimeoutError);
    expect(result.message).toBe('read ECONNRESET');
    expect(result.cause).toBe(error);
  });

  it('should fall back to NFeTsError for unrelated errors', () => {
    const error = new Error('certificate has expired');

    const mapped = mapTransmissionError(error);

    expectIsLeft(mapped);
    const result = mapped.value;
    expect(result).toBeInstanceOf(NFeTsError);
    expect(result).not.toBeInstanceOf(TransmissionError);
  });

  it('should wrap leftFromTransmissionError in Left', () => {
    const error = Object.assign(new Error('connect ETIMEDOUT'), {
      code: 'ETIMEDOUT',
    });
    const result = leftFromTransmissionError(error);

    expectIsLeft(result);
    expect(result.value).toBeInstanceOf(TransmissionTimeoutError);
  });
});
