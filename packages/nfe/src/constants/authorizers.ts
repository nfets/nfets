import environments from './environments';
import models from './models';
import versions from './versions';

const authorizers = {
  [models.NFe]: {
    AM: {
      [environments.homolog]: {
        [versions.v4_00]: {
          NfeInutilizacao:
            'https://homnfe.sefaz.am.gov.br/services2/services/NfeInutilizacao4',
          NfeConsultaProtocolo:
            'https://homnfe.sefaz.am.gov.br/services2/services/NfeConsulta4',
          NfeStatusServico:
            'https://homnfe.sefaz.am.gov.br/services2/services/NfeStatusServico4',
          RecepcaoEvento:
            'https://homnfe.sefaz.am.gov.br/services2/services/RecepcaoEvento4',
          NFeAutorizacao:
            'https://homnfe.sefaz.am.gov.br/services2/services/NfeAutorizacao4',
          NFeRetAutorizacao:
            'https://homnfe.sefaz.am.gov.br/services2/services/NfeRetAutorizacao4',
        },
      },
    },
    BA: {
      [environments.homolog]: {
        [versions.v4_00]: {
          NfeInutilizacao:
            'https://hnfe.sefaz.ba.gov.br/webservices/NFeInutilizacao4/NFeInutilizacao4.asmx',
          NfeConsultaProtocolo:
            'https://hnfe.sefaz.ba.gov.br/webservices/NFeConsultaProtocolo4/NFeConsultaProtocolo4.asmx',
          NfeStatusServico:
            'https://hnfe.sefaz.ba.gov.br/webservices/NFeStatusServico4/NFeStatusServico4.asmx',
          NfeConsultaCadastro:
            'https://hnfe.sefaz.ba.gov.br/webservices/CadConsultaCadastro4/CadConsultaCadastro4.asmx',
          RecepcaoEvento:
            'https://hnfe.sefaz.ba.gov.br/webservices/NFeRecepcaoEvento4/NFeRecepcaoEvento4.asmx',
          NFeAutorizacao:
            'https://hnfe.sefaz.ba.gov.br/webservices/NFeAutorizacao4/NFeAutorizacao4.asmx',
          NFeRetAutorizacao:
            'https://hnfe.sefaz.ba.gov.br/webservices/NFeRetAutorizacao4/NFeRetAutorizacao4.asmx',
        },
      },
    },
    GO: {
      [environments.homolog]: {
        [versions.v4_00]: {
          NfeInutilizacao:
            'https://homolog.sefaz.go.gov.br/nfe/services/NFeInutilizacao4',
          NfeConsultaProtocolo:
            'https://homolog.sefaz.go.gov.br/nfe/services/NFeConsultaProtocolo4',
          NfeStatusServico:
            'https://homolog.sefaz.go.gov.br/nfe/services/NFeStatusServico4',
          NfeConsultaCadastro:
            'https://homolog.sefaz.go.gov.br/nfe/services/CadConsultaCadastro4',
          RecepcaoEvento:
            'https://homolog.sefaz.go.gov.br/nfe/services/NFeRecepcaoEvento4',
          NFeAutorizacao:
            'https://homolog.sefaz.go.gov.br/nfe/services/NFeAutorizacao4',
          NFeRetAutorizacao:
            'https://homolog.sefaz.go.gov.br/nfe/services/NFeRetAutorizacao4',
        },
      },
    },
    MG: {
      [environments.homolog]: {
        [versions.v4_00]: {
          NfeInutilizacao:
            'https://hnfe.fazenda.mg.gov.br/nfe2/services/NFeInutilizacao4',
          NfeConsultaProtocolo:
            'https://hnfe.fazenda.mg.gov.br/nfe2/services/NFeConsultaProtocolo4',
          NfeStatusServico:
            'https://hnfe.fazenda.mg.gov.br/nfe2/services/NFeStatusServico4',
          NfeConsultaCadastro:
            'https://hnfe.fazenda.mg.gov.br/nfe2/services/CadConsultaCadastro4',
          RecepcaoEvento:
            'https://hnfe.fazenda.mg.gov.br/nfe2/services/NFeRecepcaoEvento4',
          NFeAutorizacao:
            'https://hnfe.fazenda.mg.gov.br/nfe2/services/NFeAutorizacao4',
          NFeRetAutorizacao:
            'https://hnfe.fazenda.mg.gov.br/nfe2/services/NFeRetAutorizacao4',
        },
      },
    },
    MS: {
      [environments.homolog]: {
        [versions.v4_00]: {
          NfeInutilizacao:
            'https://hom.nfe.sefaz.ms.gov.br/ws/NFeInutilizacao4',
          NfeConsultaProtocolo:
            'https://hom.nfe.sefaz.ms.gov.br/ws/NFeConsultaProtocolo4',
          NfeStatusServico:
            'https://hom.nfe.sefaz.ms.gov.br/ws/NFeStatusServico4',
          NfeConsultaCadastro:
            'https://hom.nfe.sefaz.ms.gov.br/ws/CadConsultaCadastro4',
          RecepcaoEvento:
            'https://hom.nfe.sefaz.ms.gov.br/ws/NFeRecepcaoEvento4',
          NFeAutorizacao: 'https://hom.nfe.sefaz.ms.gov.br/ws/NFeAutorizacao4',
          NFeRetAutorizacao:
            'https://hom.nfe.sefaz.ms.gov.br/ws/NFeRetAutorizacao4',
        },
      },
    },
    MT: {
      [environments.homolog]: {
        [versions.v4_00]: {
          NfeInutilizacao:
            'https://homologacao.sefaz.mt.gov.br/nfews/v2/services/NfeInutilizacao4',
          NfeConsultaProtocolo:
            'https://homologacao.sefaz.mt.gov.br/nfews/v2/services/NfeConsulta4',
          NfeStatusServico:
            'https://homologacao.sefaz.mt.gov.br/nfews/v2/services/NfeStatusServico4',
          NfeConsultaCadastro:
            'https://homologacao.sefaz.mt.gov.br/nfews/v2/services/CadConsultaCadastro4',
          RecepcaoEvento:
            'https://homologacao.sefaz.mt.gov.br/nfews/v2/services/RecepcaoEvento4',
          NFeAutorizacao:
            'https://homologacao.sefaz.mt.gov.br/nfews/v2/services/NfeAutorizacao4',
          NFeRetAutorizacao:
            'https://homologacao.sefaz.mt.gov.br/nfews/v2/services/NfeRetAutorizacao4',
        },
      },
    },
    PE: {
      [environments.homolog]: {
        [versions.v4_00]: {
          NfeInutilizacao:
            'https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/NFeInutilizacao4',
          NfeConsultaProtocolo:
            'https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/NFeConsultaProtocolo4',
          NfeStatusServico:
            'https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/NFeStatusServico4',
          NfeConsultaCadastro:
            'https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/CadConsultaCadastro4',
          RecepcaoEvento:
            'https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/NFeRecepcaoEvento4',
          NFeAutorizacao:
            'https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/NFeAutorizacao4',
          NFeRetAutorizacao:
            'https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/NFeRetAutorizacao4',
        },
      },
    },
    PR: {
      [environments.homolog]: {
        [versions.v4_00]: {
          NfeInutilizacao:
            'https://homologacao.nfe.sefa.pr.gov.br/nfe/NFeInutilizacao4',
          NfeConsultaProtocolo:
            'https://homologacao.nfe.sefa.pr.gov.br/nfe/NFeConsultaProtocolo4',
          NfeStatusServico:
            'https://homologacao.nfe.sefa.pr.gov.br/nfe/NFeStatusServico4',
          NfeConsultaCadastro:
            'https://homologacao.nfe.sefa.pr.gov.br/nfe/CadConsultaCadastro4',
          RecepcaoEvento:
            'https://homologacao.nfe.sefa.pr.gov.br/nfe/NFeRecepcaoEvento4',
          NFeAutorizacao:
            'https://homologacao.nfe.sefa.pr.gov.br/nfe/NFeAutorizacao4',
          NFeRetAutorizacao:
            'https://homologacao.nfe.sefa.pr.gov.br/nfe/NFeRetAutorizacao4',
        },
      },
    },
    RS: {
      [environments.homolog]: {
        [versions.v4_00]: {
          NfeInutilizacao:
            'https://nfe-homologacao.sefazrs.rs.gov.br/ws/nfeinutilizacao/nfeinutilizacao4.asmx',
          NfeConsultaProtocolo:
            'https://nfe-homologacao.sefazrs.rs.gov.br/ws/NfeConsulta/NfeConsulta4.asmx',
          NfeStatusServico:
            'https://nfe-homologacao.sefazrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx',
          NfeConsultaCadastro:
            'https://cad.sefazrs.rs.gov.br/ws/cadconsultacadastro/cadconsultacadastro4.asmx',
          RecepcaoEvento:
            'https://nfe-homologacao.sefazrs.rs.gov.br/ws/recepcaoevento/recepcaoevento4.asmx',
          NFeAutorizacao:
            'https://nfe-homologacao.sefazrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
          NFeRetAutorizacao:
            'https://nfe-homologacao.sefazrs.rs.gov.br/ws/NfeRetAutorizacao/NFeRetAutorizacao4.asmx',
        },
      },
    },
    SP: {
      [environments.homolog]: {
        [versions.v4_00]: {
          NfeInutilizacao:
            'https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeinutilizacao4.asmx',
          NfeConsultaProtocolo:
            'https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeconsultaprotocolo4.asmx',
          NfeStatusServico:
            'https://homologacao.nfe.fazenda.sp.gov.br/ws/nfestatusservico4.asmx',
          NfeConsultaCadastro:
            'https://homologacao.nfe.fazenda.sp.gov.br/ws/cadconsultacadastro4.asmx',
          RecepcaoEvento:
            'https://homologacao.nfe.fazenda.sp.gov.br/ws/nferecepcaoevento4.asmx',
          NFeAutorizacao:
            'https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx',
          NFeRetAutorizacao:
            'https://homologacao.nfe.fazenda.sp.gov.br/ws/nferetautorizacao4.asmx',
        },
      },
    },
    SVAN: {
      [environments.homolog]: {
        [versions.v4_00]: {
          NfeInutilizacao:
            'https://hom.sefazvirtual.fazenda.gov.br/NFeInutilizacao4/NFeInutilizacao4.asmx',
          NfeConsultaProtocolo:
            'https://hom.sefazvirtual.fazenda.gov.br/NFeConsultaProtocolo4/NFeConsultaProtocolo4.asmx',
          NfeStatusServico:
            'https://hom.sefazvirtual.fazenda.gov.br/NFeStatusServico4/NFeStatusServico4.asmx',
          RecepcaoEvento:
            'https://hom.sefazvirtual.fazenda.gov.br/NFeRecepcaoEvento4/NFeRecepcaoEvento4.asmx',
          NFeAutorizacao:
            'https://hom.sefazvirtual.fazenda.gov.br/NFeAutorizacao4/NFeAutorizacao4.asmx',
          NFeRetAutorizacao:
            'https://hom.sefazvirtual.fazenda.gov.br/NFeRetAutorizacao4/NFeRetAutorizacao4.asmx',
        },
      },
    },
    SVRS: {
      [environments.homolog]: {
        [versions.v4_00]: {
          NfeInutilizacao:
            'https://nfe-homologacao.svrs.rs.gov.br/ws/nfeinutilizacao/nfeinutilizacao4.asmx',
          NfeConsultaProtocolo:
            'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeConsulta/NfeConsulta4.asmx',
          NfeStatusServico:
            'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx',
          NfeConsultaCadastro:
            'https://cad-homologacao.svrs.rs.gov.br/ws/cadconsultacadastro/cadconsultacadastro4.asmx',
          RecepcaoEvento:
            'https://nfe-homologacao.svrs.rs.gov.br/ws/recepcaoevento/recepcaoevento4.asmx',
          NFeAutorizacao:
            'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
          NFeRetAutorizacao:
            'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeRetAutorizacao/NFeRetAutorizacao4.asmx',
        },
      },
    },
    SVCAN: {
      [environments.homolog]: {
        [versions.v4_00]: {
          NfeInutilizacao:
            'https://hom.sefazvirtual.fazenda.gov.br/NFeInutilizacao4/NFeInutilizacao4.asmx',
          NfeConsultaProtocolo:
            'https://hom.sefazvirtual.fazenda.gov.br/NFeConsultaProtocolo4/NFeConsultaProtocolo4.asmx',
          NfeStatusServico:
            'https://hom.sefazvirtual.fazenda.gov.br/NFeStatusServico4/NFeStatusServico4.asmx',
          RecepcaoEvento:
            'https://hom.sefazvirtual.fazenda.gov.br/NFeRecepcaoEvento4/NFeRecepcaoEvento4.asmx',
          NFeAutorizacao:
            'https://hom.sefazvirtual.fazenda.gov.br/NFeAutorizacao4/NFeAutorizacao4.asmx',
          NFeRetAutorizacao:
            'https://hom.sefazvirtual.fazenda.gov.br/NFeRetAutorizacao4/NFeRetAutorizacao4.asmx',
        },
      },
    },
    SVSRS: {
      [environments.homolog]: {
        [versions.v4_00]: {
          NfeConsultaProtocolo:
            'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeConsulta/NfeConsulta4.asmx',
          NfeStatusServico:
            'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx',
          RecepcaoEvento:
            'https://nfe-homologacao.svrs.rs.gov.br/ws/recepcaoevento/recepcaoevento4.asmx',
          NFeAutorizacao:
            'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
          NFeRetAutorizacao:
            'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeRetAutorizacao/NFeRetAutorizacao4.asmx',
        },
      },
    },
    AN: {
      [environments.homolog]: {
        [versions.v1_00]: {
          NFeDistribuicaoDFe:
            'https://hom1.nfe.fazenda.gov.br/NFeDistribuicaoDFe/NFeDistribuicaoDFe.asmx',
        },
        [versions.v4_00]: {
          RecepcaoEvento:
            'https://hom1.nfe.fazenda.gov.br/NFeRecepcaoEvento4/NFeRecepcaoEvento4.asmx',
        },
      },
    },
  },
} as const;

export type Authorizer = (typeof authorizers)[keyof typeof authorizers];

export default authorizers;
