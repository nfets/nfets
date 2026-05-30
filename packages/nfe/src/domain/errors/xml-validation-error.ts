import { NFeTsError } from '@nfets/core/domain';

export class XmlValidationError extends NFeTsError {
  public readonly name = 'XmlValidationError';

  public constructor(
    message: string,
    public readonly xml: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
  }
}
