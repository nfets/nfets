import type { DanfcePdfDocument } from '../../../nfce/danfce';

import { QRCode } from '../../../nfce/builder/qr-code';
import { AggregateQrCodeToProtocols } from '../../../nfce/builder/aggregate-qr-code-to-protocols';

import { SimplificadoTipo2Footer } from './footer';
import { SimplificadoTipo2RecipientAggregate } from './aggregate-recipient-to-protocols';

export class SimplificadoTipo2QrAggregate extends AggregateQrCodeToProtocols {
  private static current?: SimplificadoTipo2QrAggregate;

  public static instance(
    context: DanfcePdfDocument,
  ): SimplificadoTipo2QrAggregate {
    return (SimplificadoTipo2QrAggregate.current ??=
      new SimplificadoTipo2QrAggregate(context));
  }

  public end() {
    SimplificadoTipo2QrAggregate.current = undefined;
    this.builders.forEach((builder) => builder.end());
  }

  protected get builders() {
    return [
      SimplificadoTipo2RecipientAggregate.instance(this.context),
      QRCode.instance(this.context),
      SimplificadoTipo2Footer.instance(this.context),
    ] as const;
  }
}
