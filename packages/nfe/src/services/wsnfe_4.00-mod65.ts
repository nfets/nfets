import { Environment } from '@nfets/core/domain';

export default {
  AC: {
    [Environment.Homolog]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'http://www.hml.sefaznet.ac.gov.br/nfce/qrcode',
      },
    },
    [Environment.Production]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'http://www.sefaznet.ac.gov.br/nfce/qrcode',
      },
    },
  },
  AL: {
    [Environment.Homolog]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'http://nfce.sefaz.al.gov.br/QRCode/consultarNFCe.jsp',
      },
    },
    [Environment.Production]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'http://nfce.sefaz.al.gov.br/QRCode/consultarNFCe.jsp',
      },
    },
  },
  AM: {
    [Environment.Homolog]: {
      NfeAutorizacao: {
        method: 'nfeAutorizacaoLote',
        operation: 'NFeAutorizacao4',
        version: '4.00',
        url: 'https://homnfce.sefaz.am.gov.br/nfce-services/services/NfeAutorizacao4',
      },
      NfeRetAutorizacao: {
        method: 'nfeRetAutorizacaoLote',
        operation: 'NFeRetAutorizacao4',
        version: '4.00',
        url: 'https://homnfce.sefaz.am.gov.br/nfce-services/services/NfeRetAutorizacao4',
      },
      NfeInutilizacao: {
        method: 'nfeInutilizacaoNF',
        operation: 'NFeInutilizacao4',
        version: '4.00',
        url: 'https://homnfce.sefaz.am.gov.br/nfce-services/services/NfeInutilizacao4',
      },
      NfeConsultaProtocolo: {
        method: 'nfeConsultaNF',
        operation: 'NFeConsultaProtocolo4',
        version: '4.00',
        url: 'https://homnfce.sefaz.am.gov.br/nfce-services/services/NfeConsulta4',
      },
      NfeStatusServico: {
        method: 'nfeStatusServicoNF',
        operation: 'NFeStatusServico4',
        version: '4.00',
        url: 'https://homnfce.sefaz.am.gov.br/nfce-services/services/NfeStatusServico4',
      },
      RecepcaoEvento: {
        method: 'nfeRecepcaoEvento',
        operation: 'NFeRecepcaoEvento4',
        version: '1.00',
        url: 'https://homnfce.sefaz.am.gov.br/nfce-services/services/RecepcaoEvento4',
      },
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'https://sistemas.sefaz.am.gov.br/nfceweb-hom/consultarNFCe.jsp',
      },
      CscNFCe: {
        method: 'admCscNFCe',
        operation: 'CscNFCe',
        version: '1.00',
        url: 'https://homnfce.sefaz.am.gov.br/nfce-services/services/CscNFCe',
      },
    },
    [Environment.Production]: {
      NfeAutorizacao: {
        method: 'nfeAutorizacaoLote',
        operation: 'NFeAutorizacao4',
        version: '4.00',
        url: 'https://nfce.sefaz.am.gov.br/nfce-services/services/NfeAutorizacao4',
      },
      NfeRetAutorizacao: {
        method: 'nfeRetAutorizacaoLote',
        operation: 'NFeRetAutorizacao4',
        version: '4.00',
        url: 'https://nfce.sefaz.am.gov.br/nfce-services/services/NfeRetAutorizacao4',
      },
      NfeInutilizacao: {
        method: 'nfeInutilizacaoNF',
        operation: 'NFeInutilizacao4',
        version: '4.00',
        url: 'https://nfce.sefaz.am.gov.br/nfce-services/services/NfeInutilizacao4',
      },
      NfeConsultaProtocolo: {
        method: 'nfeConsultaNF',
        operation: 'NFeConsultaProtocolo4',
        version: '4.00',
        url: 'https://nfce.sefaz.am.gov.br/nfce-services/services/NfeConsulta4',
      },
      NfeStatusServico: {
        method: 'nfeStatusServicoNF',
        operation: 'NFeStatusServico4',
        version: '4.00',
        url: 'https://nfce.sefaz.am.gov.br/nfce-services/services/NfeStatusServico4',
      },
      RecepcaoEvento: {
        method: 'nfeRecepcaoEvento',
        operation: 'NFeRecepcaoEvento4',
        version: '1.00',
        url: 'https://nfce.sefaz.am.gov.br/nfce-services/services/RecepcaoEvento4',
      },
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'https://sistemas.sefaz.am.gov.br/nfceweb/consultarNFCe.jsp',
      },
      CscNFCe: {
        method: 'admCscNFCe',
        operation: 'CscNFCe',
        version: '1.00',
        url: 'https://nfce.sefaz.am.gov.br/nfce-services/services/CscNFCe',
      },
    },
  },
  AP: {
    [Environment.Homolog]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'https://www.sefaz.ap.gov.br/nfcehml/nfce.php',
      },
    },
    [Environment.Production]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'https://www.sefaz.ap.gov.br/nfce/nfcep.php',
      },
    },
  },
  BA: {
    [Environment.Homolog]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'http://hnfe.sefaz.ba.gov.br/servicos/nfce/qrcode.aspx',
      },
    },
    [Environment.Production]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'http://nfe.sefaz.ba.gov.br/servicos/nfce/qrcode.aspx',
      },
    },
  },
  CE: {
    [Environment.Homolog]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'http://nfceh.sefaz.ce.gov.br/pages/ShowNFCe.html',
      },
    },
    [Environment.Production]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'http://nfce.sefaz.ce.gov.br/pages/ShowNFCe.html',
      },
    },
  },
  DF: {
    [Environment.Homolog]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'http://dec.fazenda.df.gov.br/ConsultarNFCe.aspx',
      },
    },
    [Environment.Production]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'http://www.fazenda.df.gov.br/nfce/qrcode',
      },
    },
  },
  ES: {
    [Environment.Homolog]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'http://homologacao.sefaz.es.gov.br/ConsultaNFCe/qrcode.aspx',
      },
    },
    [Environment.Production]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'http://app.sefaz.es.gov.br/ConsultaNFCe/qrcode.aspx',
      },
    },
  },
  GO: {
    [Environment.Homolog]: {
      NfeAutorizacao: {
        method: 'nfeAutorizacaoLote',
        operation: 'NFeAutorizacao4',
        version: '4.00',
        url: 'https://homolog.sefaz.go.gov.br/nfe/services/NFeAutorizacao4',
      },
      NfeRetAutorizacao: {
        method: 'nfeRetAutorizacaoLote',
        operation: 'NFeRetAutorizacao4',
        version: '4.00',
        url: 'https://homolog.sefaz.go.gov.br/nfe/services/NFeRetAutorizacao4',
      },
      NfeInutilizacao: {
        method: 'nfeInutilizacaoNF',
        operation: 'NFeInutilizacao4',
        version: '4.00',
        url: 'https://homolog.sefaz.go.gov.br/nfe/services/NFeInutilizacao4',
      },
      NfeConsultaProtocolo: {
        method: 'nfeConsultaNF',
        operation: 'NFeConsultaProtocolo4',
        version: '4.00',
        url: 'https://homolog.sefaz.go.gov.br/nfe/services/NFeConsultaProtocolo4',
      },
      NfeStatusServico: {
        method: 'nfeStatusServicoNF',
        operation: 'NFeStatusServico4',
        version: '4.00',
        url: 'https://homolog.sefaz.go.gov.br/nfe/services/NFeStatusServico4',
      },
      RecepcaoEvento: {
        method: 'nfeRecepcaoEvento',
        operation: 'NFeRecepcaoEvento',
        version: '1.00',
        url: 'https://homolog.sefaz.go.gov.br/nfe/services/NFeRecepcaoEvento4',
      },
      CscNFCe: {
        method: 'admCscNFCe',
        operation: 'CscNFCe',
        version: '1.00',
        url: 'https://homolog.sefaz.go.gov.br/nfe/services/v2/CscNFCe',
      },
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'https://nfewebhomolog.sefaz.go.gov.br/nfeweb/sites/nfce/danfeNFCe',
      },
    },
    [Environment.Production]: {
      NfeAutorizacao: {
        method: 'nfeAutorizacaoLote',
        operation: 'NFeAutorizacao4',
        version: '4.00',
        url: 'https://nfe.sefaz.go.gov.br/nfe/services/NFeAutorizacao4',
      },
      NfeRetAutorizacao: {
        method: 'nfeRetAutorizacaoLote',
        operation: 'NFeRetAutorizacao4',
        version: '4.00',
        url: 'https://nfe.sefaz.go.gov.br/nfe/services/NFeRetAutorizacao4',
      },
      NfeInutilizacao: {
        method: 'nfeInutilizacaoNF',
        operation: 'NFeInutilizacao4',
        version: '4.00',
        url: 'https://nfe.sefaz.go.gov.br/nfe/services/NFeInutilizacao4',
      },
      NfeConsultaProtocolo: {
        method: 'nfeConsultaNF',
        operation: 'NFeConsultaProtocolo4',
        version: '4.00',
        url: 'https://nfe.sefaz.go.gov.br/nfe/services/NFeConsultaProtocolo4',
      },
      NfeStatusServico: {
        method: 'nfeStatusServicoNF',
        operation: 'NFeStatusServico4',
        version: '4.00',
        url: 'https://nfe.sefaz.go.gov.br/nfe/services/NFeStatusServico4',
      },
      RecepcaoEvento: {
        method: 'nfeRecepcaoEvento',
        operation: 'NFeRecepcaoEvento',
        version: '1.00',
        url: 'https://nfe.sefaz.go.gov.br/nfe/services/NFeRecepcaoEvento4',
      },
      CscNFCe: {
        method: 'admCscNFCe',
        operation: 'CscNFCe',
        version: '1.00',
        url: 'https://nfe.sefaz.go.gov.br/nfe/services/v2/CscNFCe',
      },
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'https://nfeweb.sefaz.go.gov.br/nfeweb/sites/nfce/danfeNFCe',
      },
    },
  },
  MA: {
    [Environment.Homolog]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'http://www.hom.nfce.sefaz.ma.gov.br/portal/consultarNFCe.jsp',
      },
    },
    [Environment.Production]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'http://www.nfce.sefaz.ma.gov.br/portal/consultarNFCe.jsp',
      },
    },
  },
  MG: {
    [Environment.Homolog]: {
      NfeAutorizacao: {
        method: 'nfeAutorizacaoLote',
        operation: 'NFeAutorizacao4',
        version: '4.00',
        url: 'https://hnfce.fazenda.mg.gov.br/nfce/services/NFeAutorizacao4',
      },
      NfeRetAutorizacao: {
        method: 'nfeRetAutorizacaoLote',
        operation: 'NFeRetAutorizacao4',
        version: '4.00',
        url: 'https://hnfce.fazenda.mg.gov.br/nfce/services/NFeRetAutorizacao4',
      },
      NfeInutilizacao: {
        method: 'nfeInutilizacaoNF',
        operation: 'NFeInutilizacao4',
        version: '4.00',
        url: 'https://hnfce.fazenda.mg.gov.br/nfce/services/NFeInutilizacao4',
      },
      NfeConsultaProtocolo: {
        method: 'nfeConsultaNF',
        operation: 'NFeConsultaProtocolo4',
        version: '4.00',
        url: 'https://hnfce.fazenda.mg.gov.br/nfce/services/NFeConsultaProtocolo4',
      },
      NfeStatusServico: {
        method: 'nfeStatusServicoNF',
        operation: 'NFeStatusServico4',
        version: '4.00',
        url: 'https://hnfce.fazenda.mg.gov.br/nfce/services/NFeStatusServico4',
      },
      RecepcaoEvento: {
        method: 'nfeRecepcaoEvento',
        operation: 'NFeRecepcaoEvento4',
        version: '1.00',
        url: 'https://hnfce.fazenda.mg.gov.br/nfce/services/NFeRecepcaoEvento4',
      },
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml',
      },
    },
    [Environment.Production]: {
      NfeAutorizacao: {
        method: 'nfeAutorizacaoLote',
        operation: 'NFeAutorizacao4',
        version: '4.00',
        url: 'https://nfce.fazenda.mg.gov.br/nfce/services/NFeAutorizacao4',
      },
      NfeRetAutorizacao: {
        method: 'nfeRetAutorizacaoLote',
        operation: 'NFeRetAutorizacao4',
        version: '4.00',
        url: 'https://nfce.fazenda.mg.gov.br/nfce/services/NFeRetAutorizacao4',
      },
      NfeInutilizacao: {
        method: 'nfeInutilizacaoNF',
        operation: 'NFeInutilizacao4',
        version: '4.00',
        url: 'https://nfce.fazenda.mg.gov.br/nfce/services/NFeInutilizacao4',
      },
      NfeConsultaProtocolo: {
        method: 'nfeConsultaNF',
        operation: 'NFeConsultaProtocolo4',
        version: '4.00',
        url: 'https://nfce.fazenda.mg.gov.br/nfce/services/NFeConsultaProtocolo4',
      },
      NfeStatusServico: {
        method: 'nfeStatusServicoNF',
        operation: 'NFeStatusServico4',
        version: '4.00',
        url: 'https://nfce.fazenda.mg.gov.br/nfce/services/NFeStatusServico4',
      },
      RecepcaoEvento: {
        method: 'nfeRecepcaoEvento',
        operation: 'NFeRecepcaoEvento4',
        version: '1.00',
        url: 'https://nfce.fazenda.mg.gov.br/nfce/services/NFeRecepcaoEvento4',
      },
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml',
      },
    },
  },
  MT: {
    [Environment.Homolog]: {
      NfeAutorizacao: {
        method: 'nfeAutorizacaoLote',
        operation: 'NFeAutorizacao4',
        version: '4.00',
        url: 'https://homologacao.sefaz.mt.gov.br/nfcews/services/NfeAutorizacao4',
      },
      NfeRetAutorizacao: {
        method: 'nfeRetAutorizacaoLote',
        operation: 'NFeRetAutorizacao4',
        version: '4.00',
        url: 'https://homologacao.sefaz.mt.gov.br/nfcews/services/NfeRetAutorizacao4',
      },
      NfeInutilizacao: {
        method: 'nfeInutilizacaoNF',
        operation: 'NFeInutilizacao4',
        version: '4.00',
        url: 'https://homologacao.sefaz.mt.gov.br/nfcews/services/NfeInutilizacao4',
      },
      NfeConsultaProtocolo: {
        method: 'nfeConsultaNF',
        operation: 'NFeConsultaProtocolo4',
        version: '4.00',
        url: 'https://homologacao.sefaz.mt.gov.br/nfcews/services/NfeConsulta4',
      },
      NfeStatusServico: {
        method: 'nfeStatusServicoNF',
        operation: 'NFeStatusServico4',
        version: '4.00',
        url: 'https://homologacao.sefaz.mt.gov.br/nfcews/services/NfeStatusServico4',
      },
      RecepcaoEvento: {
        method: 'nfeRecepcaoEvento',
        operation: 'NFeRecepcaoEvento4',
        version: '1.00',
        url: 'https://homologacao.sefaz.mt.gov.br/nfcews/services/RecepcaoEvento4',
      },
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'http://homologacao.sefaz.mt.gov.br/nfce/consultanfce',
      },
    },
    [Environment.Production]: {
      NfeAutorizacao: {
        method: 'nfeAutorizacaoLote',
        operation: 'NFeAutorizacao4',
        version: '4.00',
        url: 'https://nfce.sefaz.mt.gov.br/nfcews/services/NfeAutorizacao4',
      },
      NfeRetAutorizacao: {
        method: 'nfeRetAutorizacaoLote',
        operation: 'NFeRetAutorizacao4',
        version: '4.00',
        url: 'https://nfce.sefaz.mt.gov.br/nfcews/services/NfeRetAutorizacao4',
      },
      NfeInutilizacao: {
        method: 'nfeInutilizacaoNF',
        operation: 'NFeInutilizacao4',
        version: '4.00',
        url: 'https://nfce.sefaz.mt.gov.br/nfcews/services/NfeInutilizacao4',
      },
      NfeConsultaProtocolo: {
        method: 'nfeConsultaNF',
        operation: 'NFeConsultaProtocolo4',
        version: '4.00',
        url: 'https://nfce.sefaz.mt.gov.br/nfcews/services/NfeConsulta4',
      },
      NfeStatusServico: {
        method: 'nfeStatusServicoNF',
        operation: 'NFeStatusServico4',
        version: '4.00',
        url: 'https://nfce.sefaz.mt.gov.br/nfcews/services/NfeStatusServico4',
      },
      RecepcaoEvento: {
        method: 'nfeRecepcaoEvento',
        operation: 'NFeRecepcaoEvento4',
        version: '1.00',
        url: 'https://nfce.sefaz.mt.gov.br/nfcews/services/RecepcaoEvento4',
      },
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'http://www.sefaz.mt.gov.br/nfce/consultanfce',
      },
    },
  },
  MS: {
    [Environment.Homolog]: {
      NfeAutorizacao: {
        method: 'nfeAutorizacaoLote',
        operation: 'NFeAutorizacao4',
        version: '4.00',
        url: 'https://hom.nfce.sefaz.ms.gov.br/ws/NFeAutorizacao4',
      },
      NfeRetAutorizacao: {
        method: 'nfeRetAutorizacaoLote',
        operation: 'NFeRetAutorizacao4',
        version: '4.00',
        url: 'https://hom.nfce.sefaz.ms.gov.br/ws/NFeRetAutorizacao4',
      },
      NfeInutilizacao: {
        method: 'nfeInutilizacaoNF',
        operation: 'NFeInutilizacao4',
        version: '4.00',
        url: 'https://hom.nfce.sefaz.ms.gov.br/ws/NFeInutilizacao4',
      },
      NfeConsultaProtocolo: {
        method: 'nfeConsultaNF',
        operation: 'NFeConsultaProtocolo4',
        version: '4.00',
        url: 'https://hom.nfce.sefaz.ms.gov.br/ws/NFeConsultaProtocolo4',
      },
      NfeStatusServico: {
        method: 'nfeStatusServicoNF',
        operation: 'NFeStatusServico4',
        version: '4.00',
        url: 'https://hom.nfce.sefaz.ms.gov.br/ws/NFeStatusServico4',
      },
      RecepcaoEvento: {
        method: 'nfeRecepcaoEvento',
        operation: 'NFeRecepcaoEvento4',
        version: '1.00',
        url: 'https://hom.nfce.sefaz.ms.gov.br/ws/NFeRecepcaoEvento4',
      },
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'http://www.dfe.ms.gov.br/nfce/qrcode',
      },
    },
    [Environment.Production]: {
      NfeAutorizacao: {
        method: 'nfeAutorizacaoLote',
        operation: 'NFeAutorizacao4',
        version: '4.00',
        url: 'https://nfce.sefaz.ms.gov.br/ws/NFeAutorizacao4',
      },
      NfeRetAutorizacao: {
        method: 'nfeRetAutorizacaoLote',
        operation: 'NFeRetAutorizacao4',
        version: '4.00',
        url: 'https://nfce.sefaz.ms.gov.br/ws/NFeRetAutorizacao4',
      },
      NfeInutilizacao: {
        method: 'nfeInutilizacaoNF',
        operation: 'NFeInutilizacao4',
        version: '4.00',
        url: 'https://nfce.sefaz.ms.gov.br/ws/NFeInutilizacao4',
      },
      NfeConsultaProtocolo: {
        method: 'nfeConsultaNF',
        operation: 'NFeConsultaProtocolo4',
        version: '4.00',
        url: 'https://nfce.sefaz.ms.gov.br/ws/NFeConsultaProtocolo4',
      },
      NfeStatusServico: {
        method: 'nfeStatusServicoNF',
        operation: 'NFeStatusServico4',
        version: '4.00',
        url: 'https://nfce.sefaz.ms.gov.br/ws/NFeStatusServico4',
      },
      RecepcaoEvento: {
        method: 'nfeRecepcaoEvento',
        operation: 'NFeRecepcaoEvento4',
        version: '1.00',
        url: 'https://nfce.sefaz.ms.gov.br/ws/NFeRecepcaoEvento4',
      },
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'http://www.dfe.ms.gov.br/nfce/qrcode',
      },
    },
  },
  PA: {
    [Environment.Homolog]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'https://appnfc.sefa.pa.gov.br/portal-homologacao/view/consultas/nfce/nfceForm.seam',
      },
    },
    [Environment.Production]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'https://appnfc.sefa.pa.gov.br/portal/view/consultas/nfce/nfceForm.seam',
      },
    },
  },
  PB: {
    [Environment.Homolog]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'http://www.sefaz.pb.gov.br/nfcehom',
      },
    },
    [Environment.Production]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'http://www.sefaz.pb.gov.br/nfce',
      },
    },
  },
  PE: {
    [Environment.Homolog]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'http://nfcehomolog.sefaz.pe.gov.br/nfce/consulta',
      },
    },
    [Environment.Production]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'http://nfce.sefaz.pe.gov.br/nfce/consulta',
      },
    },
  },
  PI: {
    [Environment.Homolog]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'http://www.sefaz.pi.gov.br/nfce/qrcode',
      },
    },
    [Environment.Production]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'http://www.sefaz.pi.gov.br/nfce/qrcode',
      },
    },
  },
  PR: {
    [Environment.Homolog]: {
      NfeAutorizacao: {
        method: 'nfeAutorizacaoLote',
        operation: 'NFeAutorizacao4',
        version: '4.00',
        url: 'https://homologacao.nfce.sefa.pr.gov.br/nfce/NFeAutorizacao4',
      },
      NfeRetAutorizacao: {
        method: 'nfeRetAutorizacaoLote',
        operation: 'NFeRetAutorizacao4',
        version: '4.00',
        url: 'https://homologacao.nfce.sefa.pr.gov.br/nfce/NFeRetAutorizacao4',
      },
      NfeInutilizacao: {
        method: 'nfeInutilizacaoNF',
        operation: 'NFeInutilizacao4',
        version: '4.00',
        url: 'https://homologacao.nfce.sefa.pr.gov.br/nfce/NFeInutilizacao4',
      },
      NfeConsultaProtocolo: {
        method: 'nfeConsultaNF',
        operation: 'NFeConsultaProtocolo4',
        version: '4.00',
        url: 'https://homologacao.nfce.sefa.pr.gov.br/nfce/NFeConsultaProtocolo4',
      },
      NfeStatusServico: {
        method: 'nfeStatusServicoNF',
        operation: 'NFeStatusServico4',
        version: '4.00',
        url: 'https://homologacao.nfce.sefa.pr.gov.br/nfce/NFeStatusServico4',
      },
      RecepcaoEvento: {
        method: 'nfeRecepcaoEvento',
        operation: 'NFeRecepcaoEvento',
        version: '1.00',
        url: 'https://homologacao.nfce.sefa.pr.gov.br/nfce/NFeRecepcaoEvento4',
      },
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'http://www.fazenda.pr.gov.br/nfce/qrcode',
      },
    },
    [Environment.Production]: {
      NfeAutorizacao: {
        method: 'nfeAutorizacaoLote',
        operation: 'NFeAutorizacao4',
        version: '4.00',
        url: 'https://nfce.sefa.pr.gov.br/nfce/NFeAutorizacao4',
      },
      NfeRetAutorizacao: {
        method: 'nfeRetAutorizacao',
        operation: 'NFeRetAutorizacao4',
        version: '4.00',
        url: 'https://nfce.sefa.pr.gov.br/nfce/NFeRetAutorizacao4',
      },
      NfeInutilizacao: {
        method: 'nfeInutilizacaoNF',
        operation: 'NFeInutilizacao4',
        version: '4.00',
        url: 'https://nfce.sefa.pr.gov.br/nfce/NFeInutilizacao4',
      },
      NfeConsultaProtocolo: {
        method: 'nfeConsultaNF',
        operation: 'NFeConsultaProtocolo4',
        version: '4.00',
        url: 'https://nfce.sefa.pr.gov.br/nfce/NFeConsultaProtocolo4',
      },
      NfeStatusServico: {
        method: 'nfeStatusServicoNF',
        operation: 'NFeStatusServico4',
        version: '4.00',
        url: 'https://nfce.sefa.pr.gov.br/nfce/NFeStatusServico4',
      },
      RecepcaoEvento: {
        method: 'nfeRecepcaoEvento',
        operation: 'NFeRecepcaoEvento',
        version: '1.00',
        url: 'https://nfce.sefa.pr.gov.br/nfce/NFeRecepcaoEvento4',
      },
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'http://www.fazenda.pr.gov.br/nfce/qrcode',
      },
    },
  },
  RJ: {
    [Environment.Homolog]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'http://www4.fazenda.rj.gov.br/consultaNFCe/QRCode',
      },
    },
    [Environment.Production]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'https://consultadfe.fazenda.rj.gov.br/consultaNFCe/QRCode',
      },
    },
  },
  RN: {
    [Environment.Homolog]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'http://hom.nfce.set.rn.gov.br/consultarNFCe.aspx',
      },
    },
    [Environment.Production]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'http://nfce.set.rn.gov.br/consultarNFCe.aspx',
      },
    },
  },
  RO: {
    [Environment.Homolog]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'http://www.nfce.sefin.ro.gov.br/consultanfce/consulta.jsp',
      },
    },
    [Environment.Production]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'http://www.nfce.sefin.ro.gov.br/consultanfce/consulta.jsp',
      },
    },
  },
  RR: {
    [Environment.Homolog]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'http://200.174.88.103:8080/nfce/servlet/qrcode',
      },
    },
    [Environment.Production]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'https://www.sefaz.rr.gov.br/servlet/qrcode',
      },
    },
  },
  RS: {
    [Environment.Homolog]: {
      NfeAutorizacao: {
        method: 'nfeAutorizacaoLote',
        operation: 'NFeAutorizacao4',
        version: '4.00',
        url: 'https://nfce-homologacao.sefazrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
      },
      NfeRetAutorizacao: {
        method: 'nfeRetAutorizacaoLote',
        operation: 'NFeRetAutorizacao4',
        version: '4.00',
        url: 'https://nfce-homologacao.sefazrs.rs.gov.br/ws/NfeRetAutorizacao/NFeRetAutorizacao4.asmx',
      },
      NfeInutilizacao: {
        method: 'nfeInutilizacaoNF',
        operation: 'NFeInutilizacao4',
        version: '4.00',
        url: 'https://nfce-homologacao.sefazrs.rs.gov.br/ws/nfeinutilizacao/nfeinutilizacao4.asmx',
      },
      NfeConsultaProtocolo: {
        method: 'nfeConsultaNF',
        operation: 'NFeConsultaProtocolo4',
        version: '4.00',
        url: 'https://nfce-homologacao.sefazrs.rs.gov.br/ws/NfeConsulta/NfeConsulta4.asmx',
      },
      NfeStatusServico: {
        method: 'nfeStatusServicoNF',
        operation: 'NFeStatusServico4',
        version: '4.00',
        url: 'https://nfce-homologacao.sefazrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx',
      },
      RecepcaoEvento: {
        method: 'nfeRecepcaoEvento',
        operation: 'NFeRecepcaoEvento4',
        version: '1.00',
        url: 'https://nfce-homologacao.sefazrs.rs.gov.br/ws/recepcaoevento/recepcaoevento4.asmx',
      },
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'https://www.sefaz.rs.gov.br/NFCE/NFCE-COM.aspx',
      },
    },
    [Environment.Production]: {
      NfeAutorizacao: {
        method: 'nfeAutorizacaoLote',
        operation: 'NFeAutorizacao4',
        version: '4.00',
        url: 'https://nfce.sefazrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
      },
      NfeRetAutorizacao: {
        method: 'nfeRetAutorizacaoLote',
        operation: 'NFeRetAutorizacao4',
        version: '4.00',
        url: 'https://nfce.sefazrs.rs.gov.br/ws/NfeRetAutorizacao/NFeRetAutorizacao4.asmx',
      },
      NfeInutilizacao: {
        method: 'nfeInutilizacaoNF',
        operation: 'NFeInutilizacao4',
        version: '4.00',
        url: 'https://nfce.sefazrs.rs.gov.br/ws/nfeinutilizacao/nfeinutilizacao4.asmx',
      },
      NfeConsultaProtocolo: {
        method: 'nfeConsultaNF',
        operation: 'NFeConsultaProtocolo4',
        version: '4.00',
        url: 'https://nfce.sefazrs.rs.gov.br/ws/NfeConsulta/NfeConsulta4.asmx',
      },
      NfeStatusServico: {
        method: 'nfeStatusServicoNF',
        operation: 'NFeStatusServico4',
        version: '4.00',
        url: 'https://nfce.sefazrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx',
      },
      RecepcaoEvento: {
        method: 'nfeRecepcaoEvento',
        operation: 'NFeRecepcaoEvento4',
        version: '1.00',
        url: 'https://nfce.sefazrs.rs.gov.br/ws/recepcaoevento/recepcaoevento4.asmx',
      },
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'https://www.sefaz.rs.gov.br/NFCE/NFCE-COM.aspx',
      },
    },
  },
  SC: {
    [Environment.Homolog]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'https://hom.sat.sef.sc.gov.br/nfce/consulta',
      },
    },
    [Environment.Production]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'https://sat.sef.sc.gov.br/nfce/consulta',
      },
    },
  },
  SE: {
    [Environment.Homolog]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'http://www.hom.nfe.se.gov.br/nfce/qrcode',
      },
    },
    [Environment.Production]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'http://www.nfce.se.gov.br/nfce/qrcode',
      },
    },
  },
  SP: {
    [Environment.Homolog]: {
      NfeAutorizacao: {
        method: 'nfeAutorizacaoLote',
        operation: 'NFeAutorizacao4',
        version: '4.00',
        url: 'https://homologacao.nfce.fazenda.sp.gov.br/ws/NFeAutorizacao4.asmx',
      },
      NfeRetAutorizacao: {
        method: 'nfeRetAutorizacaoLote',
        operation: 'NFeRetAutorizacao4',
        version: '4.00',
        url: 'https://homologacao.nfce.fazenda.sp.gov.br/ws/NFeRetAutorizacao4.asmx',
      },
      NfeInutilizacao: {
        method: 'nfeInutilizacaoNF',
        operation: 'NFeInutilizacao4',
        version: '4.00',
        url: 'https://homologacao.nfce.fazenda.sp.gov.br/ws/NFeInutilizacao4.asmx',
      },
      NfeConsultaProtocolo: {
        method: 'nfeConsultaNF',
        operation: 'NFeConsultaProtocolo4',
        version: '4.00',
        url: 'https://homologacao.nfce.fazenda.sp.gov.br/ws/NFeConsultaProtocolo4.asmx',
      },
      NfeStatusServico: {
        method: 'nfeStatusServicoNF',
        operation: 'NFeStatusServico4',
        version: '4.00',
        url: 'https://homologacao.nfce.fazenda.sp.gov.br/ws/NFeStatusServico4.asmx',
      },
      RecepcaoEvento: {
        method: 'nfeRecepcaoEvento',
        operation: 'NFeRecepcaoEvento4',
        version: '1.00',
        url: 'https://homologacao.nfce.fazenda.sp.gov.br/ws/NFeRecepcaoEvento4.asmx',
      },
      RecepcaoEPEC: {
        method: 'nfeRecepcaoEvento',
        operation: 'RecepcaoEvento',
        version: '4.00',
        url: 'https://homologacao.nfce.epec.fazenda.sp.gov.br/EPECws/RecepcaoEPEC.asmx',
      },
      EPECStatusServico: {
        method: 'nfeStatusServicoNF2',
        operation: 'NfeStatusServico2',
        version: '4.00',
        url: 'https://homologacao.nfce.epec.fazenda.sp.gov.br/EPECws/EPECStatusServico.asmx',
      },
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'https://www.homologacao.nfce.fazenda.sp.gov.br/qrcode',
      },
    },
    [Environment.Production]: {
      NfeAutorizacao: {
        method: 'nfeAutorizacaoLote',
        operation: 'NFeAutorizacao4',
        version: '4.00',
        url: 'https://nfce.fazenda.sp.gov.br/ws/NFeAutorizacao4.asmx',
      },
      NfeRetAutorizacao: {
        method: 'nfeRetAutorizacaoLote',
        operation: 'NFeRetAutorizacao4',
        version: '4.00',
        url: 'https://nfce.fazenda.sp.gov.br/ws/NFeRetAutorizacao4.asmx',
      },
      NfeInutilizacao: {
        method: 'nfeInutilizacaoNF',
        operation: 'NFeInutilizacao4',
        version: '4.00',
        url: 'https://nfce.fazenda.sp.gov.br/ws/NFeInutilizacao4.asmx',
      },
      NfeConsultaProtocolo: {
        method: 'nfeConsultaNF',
        operation: 'NFeConsultaProtocolo4',
        version: '4.00',
        url: 'https://nfce.fazenda.sp.gov.br/ws/NFeConsultaProtocolo4.asmx',
      },
      NfeStatusServico: {
        method: 'nfeStatusServicoNF',
        operation: 'NFeStatusServico4',
        version: '4.00',
        url: 'https://nfce.fazenda.sp.gov.br/ws/NFeStatusServico4.asmx',
      },
      RecepcaoEvento: {
        method: 'nfeRecepcaoEvento',
        operation: 'NFeRecepcaoEvento4',
        version: '1.00',
        url: 'https://nfce.fazenda.sp.gov.br/ws/NFeRecepcaoEvento4.asmx',
      },
      RecepcaoEPEC: {
        method: 'nfeRecepcaoEvento',
        operation: 'RecepcaoEvento',
        version: '1.00',
        url: 'https://nfce.epec.fazenda.sp.gov.br/EPECws/RecepcaoEPEC.asmx',
      },
      EPECStatusServico: {
        method: 'nfeStatusServicoNF2',
        operation: 'NfeStatusServico2',
        version: '4.00',
        url: 'https://nfce.epec.fazenda.sp.gov.br/EPECws/EPECStatusServico.asmx',
      },
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'https://www.nfce.fazenda.sp.gov.br/qrcode',
      },
    },
  },
  TO: {
    [Environment.Homolog]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '300',
        url: 'http://homologacao.sefaz.to.gov.br/nfce/qrcode',
      },
    },
    [Environment.Production]: {
      NfeConsultaQR: {
        method: 'QR-CODE',
        operation: 'NfeConsultaQR',
        version: '200',
        url: 'http://www.sefaz.to.gov.br/nfce/qrcode',
      },
    },
  },
  SVRS: {
    [Environment.Homolog]: {
      NfeAutorizacao: {
        method: 'nfeAutorizacaoLote',
        operation: 'NFeAutorizacao4',
        version: '4.00',
        url: 'https://nfce-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
      },
      NfeRetAutorizacao: {
        method: 'nfeRetAutorizacaoLote',
        operation: 'NFeRetAutorizacao4',
        version: '4.00',
        url: 'https://nfce-homologacao.svrs.rs.gov.br/ws/NfeRetAutorizacao/NFeRetAutorizacao4.asmx',
      },
      NfeInutilizacao: {
        method: 'nfeInutilizacaoNF',
        operation: 'NFeInutilizacao4',
        version: '4.00',
        url: 'https://nfce-homologacao.svrs.rs.gov.br/ws/nfeinutilizacao/nfeinutilizacao4.asmx',
      },
      NfeConsultaProtocolo: {
        method: 'nfeConsultaNF',
        operation: 'NFeConsultaProtocolo4',
        version: '4.00',
        url: 'https://nfce-homologacao.svrs.rs.gov.br/ws/NfeConsulta/NfeConsulta4.asmx',
      },
      NfeStatusServico: {
        method: 'nfeStatusServicoNF',
        operation: 'NFeStatusServico4',
        version: '4.00',
        url: 'https://nfce-homologacao.svrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx',
      },
      RecepcaoEvento: {
        method: 'nfeRecepcaoEvento',
        operation: 'NFeRecepcaoEvento4',
        version: '1.00',
        url: 'https://nfce-homologacao.svrs.rs.gov.br/ws/recepcaoevento/recepcaoevento4.asmx',
      },
    },
    [Environment.Production]: {
      NfeAutorizacao: {
        method: 'nfeAutorizacaoLote',
        operation: 'NFeAutorizacao4',
        version: '4.00',
        url: 'https://nfce.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
      },
      NfeRetAutorizacao: {
        method: 'nfeRetAutorizacaoLote',
        operation: 'NFeRetAutorizacao4',
        version: '4.00',
        url: 'https://nfce.svrs.rs.gov.br/ws/NfeRetAutorizacao/NFeRetAutorizacao4.asmx',
      },
      NfeInutilizacao: {
        method: 'nfeInutilizacaoNF',
        operation: 'NFeInutilizacao4',
        version: '4.00',
        url: 'https://nfce.svrs.rs.gov.br/ws/nfeinutilizacao/nfeinutilizacao4.asmx',
      },
      NfeConsultaProtocolo: {
        method: 'nfeConsultaNF',
        operation: 'NFeConsultaProtocolo4',
        version: '4.00',
        url: 'https://nfce.svrs.rs.gov.br/ws/NfeConsulta/NfeConsulta4.asmx',
      },
      NfeStatusServico: {
        method: 'nfeStatusServicoNF',
        operation: 'NFeStatusServico4',
        version: '4.00',
        url: 'https://nfce.svrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx',
      },
      RecepcaoEvento: {
        method: 'nfeRecepcaoEvento',
        operation: 'NFeRecepcaoEvento4',
        version: '1.00',
        url: 'https://nfce.svrs.rs.gov.br/ws/recepcaoevento/recepcaoevento4.asmx',
      },
    },
  },
  SVAN: {
    [Environment.Homolog]: {},
    [Environment.Production]: {},
  },
} as const;
