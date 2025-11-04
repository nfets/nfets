import type { StateAcronym, StateCode } from '@nfets/core/domain';

export interface ConsultaCadastroPayload {
  xServ?: 'CONS-CAD';
  UF: StateAcronym;
  IE?: string;
  CNPJ?: string;
  CPF?: string;
}

export interface ConsultaCadastroRequest {
  ConsCad: ConsultaCadastroPayload;
}

export interface ConsultaCadastroResponse {
  retConsCad: {
    $: { versao: string };
    infCons: {
      verAplic: string;
      cStat: string;
      xMotivo: string;
      UF: StateAcronym;
      IE?: string;
      CNPJ?: string;
      CPF?: string;
      dhCons: string;
      cUF: StateCode;
      infCad?: {
        IE: string;
        CNPJ?: string;
        CPF?: string;
        UF: StateAcronym;
        cSit: string;
        indCredNFe: string;
        indCredCTe: string;
        xNome: string;
        xFant?: string;
        xRegApur?: string;
        CNAE?: string;
        dIniAtiv?: string;
        dUltSit?: string;
        dBaixa?: string;
        IEUnica?: string;
        IEAtual?: string;
        ender?: {
          xLgr?: string;
          nro?: string;
          xCpl?: string;
          xBairro?: string;
          cMun?: string;
          xMun?: string;
          CEP?: string;
        };
      }[];
    };
  };
}
