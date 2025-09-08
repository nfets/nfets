import type { InfNfe } from 'src/entities/nfe/inf-nfe';
import type { NFe } from 'src/entities/nfe/nfe';

export class NfeXmlBuilder {
  private nfe = {
    infNFe: { $: {} },
  };

  public infNfe(payload: InfNfe) {
    this.nfe.infNFe.$ = {
      Id: `NFe${payload.Id}`,
      versao: payload.versao,
      pk_nItem: payload.pk_nItem,
    };
  }
}
