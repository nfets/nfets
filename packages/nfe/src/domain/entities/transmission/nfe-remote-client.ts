import type { Client, RequestConfig } from '@nfets/core/domain';

export interface NfePayload {
  nfeDadosMsg: string;
}

export interface NfeRemoteClient extends Client {
  nfeStatusServicoNFAsync(
    args: NfePayload,
    opt?: RequestConfig,
  ): Promise<unknown[]>;
}
