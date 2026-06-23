import type { XmlToolkit } from '@nfets/core/domain';

import { TpEvent } from '@nfets/nfe/domain/entities/constants/tp-event';
import { Xml2JsToolkit } from '@nfets/core/infrastructure';
import { EventoCstatToCancelRegister } from '@nfets/nfe/domain/entities/constants/evento-cstat';
import { left, NFeTsError, right, type Either } from '@nfets/core';

const CANCELLATION_EVENT_TYPES = new Set<string>([
  TpEvent.Cancelamento,
  TpEvent.CancelamentoSubstituicao,
]);

export class NfeComplements {
  public constructor(
    private readonly toolkit: XmlToolkit = new Xml2JsToolkit(),
  ) {}

  public cancelRegister(
    nfe: string,
    cancellation: string,
  ): Either<NFeTsError, string> {
    if (!nfe.trim())
      return left(new NFeTsError('Please provide a valid authorized NFe xml'));

    const protNFe = this.toolkit.getNode(nfe, 'protNFe');
    if (!protNFe) return left(new NFeTsError('NFe not protocoladed'));

    const chaveNFe = this.toolkit.getNodeValue(protNFe, 'chNFe');
    if (!chaveNFe)
      return left(new NFeTsError('Access key not found in protNFe'));

    const retEventoXml = this.findMatchingRetEvento(cancellation, chaveNFe);
    if (!retEventoXml) return right(nfe);

    return right(this.toolkit.appendNode(nfe, retEventoXml));
  }

  private findMatchingRetEvento(
    cancellation: string,
    chaveNFe: string,
  ): string | null {
    for (const retEventoXml of this.toolkit.getNodes(
      cancellation,
      'retEvento',
    )) {
      const cStat = this.toolkit.getNodeValue(retEventoXml, 'cStat');
      const tpEvento = this.toolkit.getNodeValue(retEventoXml, 'tpEvento');
      const chaveEvento = this.toolkit.getNodeValue(retEventoXml, 'chNFe');

      if (
        cStat &&
        Object.values(EventoCstatToCancelRegister).includes(
          cStat as EventoCstatToCancelRegister,
        ) &&
        tpEvento &&
        CANCELLATION_EVENT_TYPES.has(tpEvento) &&
        chaveEvento === chaveNFe
      )
        return retEventoXml;
    }

    return null;
  }
}
