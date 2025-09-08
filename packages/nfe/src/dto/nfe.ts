import {
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { InfNFe } from './inf-nfe/inf-nfe';
import { Type } from 'class-transformer';

export class NFe {
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => InfNFe)
  declare infNFe: InfNFe;
}

class RefNFe {
  @IsOptional()
  @IsString()
  declare refNFe?: string;

  @IsOptional()
  @IsString()
  declare refNFeSig?: string;
}

class RefNF {
  @IsOptional()
  @IsString()
  declare AAMM?: string;

  @IsOptional()
  @IsString()
  declare CNPJ?: string;

  @IsOptional()
  @IsString()
  declare cUF?: string;

  @IsOptional()
  @IsString()
  declare mod?: string;

  @IsOptional()
  @IsString()
  declare nNF?: string;

  @IsOptional()
  @IsString()
  declare serie?: string;
}

class EnderEmit {
  @IsOptional()
  @IsString()
  declare CEP?: string;

  @IsOptional()
  @IsString()
  declare UF?: string;

  @IsOptional()
  @IsString()
  declare cMun?: string;

  @IsOptional()
  @IsString()
  declare cPais?: string;

  @IsOptional()
  @IsString()
  declare fone?: string;

  @IsOptional()
  @IsString()
  declare nro?: string;

  @IsOptional()
  @IsString()
  declare xBairro?: string;

  @IsOptional()
  @IsString()
  declare xCpl?: string;

  @IsOptional()
  @IsString()
  declare xLgr?: string;

  @IsOptional()
  @IsString()
  declare xMun?: string;

  @IsOptional()
  @IsString()
  declare xPais?: string;
}

class EnderDest {
  @IsOptional()
  @IsString()
  declare CEP?: string;

  @IsOptional()
  @IsString()
  declare UF?: string;

  @IsOptional()
  @IsString()
  declare cMun?: string;

  @IsOptional()
  @IsString()
  declare cPais?: string;

  @IsOptional()
  @IsString()
  declare fone?: string;

  @IsOptional()
  @IsString()
  declare nro?: string;

  @IsOptional()
  @IsString()
  declare xBairro?: string;

  @IsOptional()
  @IsString()
  declare xCpl?: string;

  @IsOptional()
  @IsString()
  declare xLgr?: string;

  @IsOptional()
  @IsString()
  declare xMun?: string;

  @IsOptional()
  @IsString()
  declare xPais?: string;
}

class Retirada {
  @IsOptional()
  @IsString()
  declare CEP?: string;

  @IsOptional()
  @IsString()
  declare CNPJ?: string;

  @IsOptional()
  @IsString()
  declare CPF?: string;

  @IsOptional()
  @IsString()
  declare IE?: string;

  @IsOptional()
  @IsString()
  declare UF?: string;

  @IsOptional()
  @IsString()
  declare cMun?: string;

  @IsOptional()
  @IsString()
  declare cPais?: string;

  @IsOptional()
  @IsString()
  declare email?: string;

  @IsOptional()
  @IsString()
  declare fone?: string;

  @IsOptional()
  @IsString()
  declare nro?: string;

  @IsOptional()
  @IsString()
  declare xBairro?: string;

  @IsOptional()
  @IsString()
  declare xCpl?: string;

  @IsOptional()
  @IsString()
  declare xLgr?: string;

  @IsOptional()
  @IsString()
  declare xMun?: string;

  @IsOptional()
  @IsString()
  declare xNome?: string;

  @IsOptional()
  @IsString()
  declare xPais?: string;
}

class Entrega {
  @IsOptional()
  @IsString()
  declare CEP?: string;

  @IsOptional()
  @IsString()
  declare CNPJ?: string;

  @IsOptional()
  @IsString()
  declare CPF?: string;

  @IsOptional()
  @IsString()
  declare IE?: string;

  @IsOptional()
  @IsString()
  declare UF?: string;

  @IsOptional()
  @IsString()
  declare cMun?: string;

  @IsOptional()
  @IsString()
  declare cPais?: string;

  @IsOptional()
  @IsString()
  declare email?: string;

  @IsOptional()
  @IsString()
  declare fone?: string;

  @IsOptional()
  @IsString()
  declare nro?: string;

  @IsOptional()
  @IsString()
  declare xBairro?: string;

  @IsOptional()
  @IsString()
  declare xCpl?: string;

  @IsOptional()
  @IsString()
  declare xLgr?: string;

  @IsOptional()
  @IsString()
  declare xMun?: string;

  @IsOptional()
  @IsString()
  declare xNome?: string;

  @IsOptional()
  @IsString()
  declare xPais?: string;
}

class AutXML {
  @IsOptional()
  @IsString()
  declare CNPJ?: string;

  @IsOptional()
  @IsString()
  declare CPF?: string;
}

class Prod {
  @IsOptional()
  @IsString()
  declare CFOP?: string;

  @IsOptional()
  @IsString()
  declare EXTIPI?: string;

  @IsOptional()
  @IsString()
  declare NCM?: string;

  @IsOptional()
  @IsString()
  declare cBarra?: string;

  @IsOptional()
  @IsString()
  declare cBarraTrib?: string;

  @IsOptional()
  @IsString()
  declare cBenef?: string;

  @IsOptional()
  @IsString()
  declare cEAN?: string;

  @IsOptional()
  @IsString()
  declare cEANTrib?: string;

  @IsOptional()
  @IsString()
  declare cProd?: string;

  @IsOptional()
  @IsString()
  declare indTot?: string;

  @IsOptional()
  @IsString()
  declare item?: string;

  @IsOptional()
  @IsString()
  declare nFCI?: string;

  @IsOptional()
  @IsString()
  declare nItemPed?: string;

  @IsOptional()
  @IsString()
  declare qCom?: string;

  @IsOptional()
  @IsString()
  declare qTrib?: string;

  @IsOptional()
  @IsString()
  declare uCom?: string;

  @IsOptional()
  @IsString()
  declare uTrib?: string;

  @IsOptional()
  @IsString()
  declare vDesc?: string;

  @IsOptional()
  @IsString()
  declare vFrete?: string;

  @IsOptional()
  @IsString()
  declare vOutro?: string;

  @IsOptional()
  @IsString()
  declare vProd?: string;

  @IsOptional()
  @IsString()
  declare vSeg?: string;

  @IsOptional()
  @IsString()
  declare vUnCom?: string;

  @IsOptional()
  @IsString()
  declare vUnTrib?: string;

  @IsOptional()
  @IsString()
  declare xPed?: string;

  @IsOptional()
  @IsString()
  declare xProd?: string;
}

class ProdObsCont {
  @IsOptional()
  @IsString()
  declare item?: string;

  @IsOptional()
  @IsString()
  declare xCampo?: string;

  @IsOptional()
  @IsString()
  declare xTexto?: string;
}

class CEST {
  @IsOptional()
  @IsString()
  declare CEST?: string;

  @IsOptional()
  @IsString()
  declare CNPJFab?: string;

  @IsOptional()
  @IsString()
  declare indEscala?: string;

  @IsOptional()
  @IsString()
  declare item?: string;
}

class Adi {
  @IsOptional()
  @IsString()
  declare cFabricante?: string;

  @IsOptional()
  @IsString()
  declare item?: string;

  @IsOptional()
  @IsString()
  declare nAdicao?: string;

  @IsOptional()
  @IsString()
  declare nDI?: string;

  @IsOptional()
  @IsString()
  declare nDraw?: string;

  @IsOptional()
  @IsString()
  declare nSeqAdic?: string;

  @IsOptional()
  @IsString()
  declare vDescDI?: string;
}

class Rastro {
  @IsOptional()
  @IsString()
  declare cAgreg?: string;

  @IsOptional()
  @IsString() // TODO: talvez seja Date
  declare dFab?: string;

  @IsOptional()
  @IsString() // TODO: talvez seja Date
  declare dVal?: string;

  @IsOptional()
  @IsString()
  declare item?: string;

  @IsOptional()
  @IsString()
  declare nLote?: string;

  @IsOptional()
  @IsString()
  declare qLote?: string;
}

class Encerrante {
  @IsOptional()
  @IsString()
  declare item?: string;

  @IsOptional()
  @IsString()
  declare nBico?: string;

  @IsOptional()
  @IsString()
  declare nBomba?: string;

  @IsOptional()
  @IsString()
  declare nTanque?: string;

  @IsOptional()
  @IsString()
  declare vEncFin?: string;

  @IsOptional()
  @IsString()
  declare vEncIni?: string;
}

class ICMSPart {
  @IsOptional()
  @IsString()
  declare CST?: string;

  @IsOptional()
  @IsString()
  declare UFST?: string;

  @IsOptional()
  @IsString()
  declare item?: string;

  @IsOptional()
  @IsString()
  declare modBC?: string;

  @IsOptional()
  @IsString()
  declare modBCST?: string;

  @IsOptional()
  @IsString()
  declare orig?: string;

  @IsOptional()
  @IsString()
  declare pBCOp?: string;

  @IsOptional()
  @IsString()
  declare pFCPST?: string;

  @IsOptional()
  @IsString()
  declare pICMS?: string;

  @IsOptional()
  @IsString()
  declare pICMSST?: string;

  @IsOptional()
  @IsString()
  declare pMVAST?: string;

  @IsOptional()
  @IsString()
  declare pRedBC?: string;

  @IsOptional()
  @IsString()
  declare pRedBCST?: string;

  @IsOptional()
  @IsString()
  declare vBC?: string;

  @IsOptional()
  @IsString()
  declare vBCFCPST?: string;

  @IsOptional()
  @IsString()
  declare vBCST?: string;

  @IsOptional()
  @IsString()
  declare vFCPST?: string;

  @IsOptional()
  @IsString()
  declare vICMS?: string;

  @IsOptional()
  @IsString()
  declare vICMSST?: string;
}

class ICMSST {
  @IsOptional()
  @IsString()
  declare CST?: string;

  @IsOptional()
  @IsString()
  declare item?: string;

  @IsOptional()
  @IsString()
  declare orig?: string;

  @IsOptional()
  @IsString()
  declare pFCPSTRet?: string;

  @IsOptional()
  @IsString()
  declare pICMSEfet?: string;

  @IsOptional()
  @IsString()
  declare pRedBCEfet?: string;

  @IsOptional()
  @IsString()
  declare pST?: string;

  @IsOptional()
  @IsString()
  declare vBCEfet?: string;

  @IsOptional()
  @IsString()
  declare vBCFCPSTRet?: string;

  @IsOptional()
  @IsString()
  declare vBCSTDest?: string;

  @IsOptional()
  @IsString()
  declare vBCSTRet?: string;

  @IsOptional()
  @IsString()
  declare vFCPSTRet?: string;

  @IsOptional()
  @IsString()
  declare vICMSEfet?: string;

  @IsOptional()
  @IsString()
  declare vICMSSTDest?: string;

  @IsOptional()
  @IsString()
  declare vICMSSTRet?: string;

  @IsOptional()
  @IsString()
  declare vICMSSubstituto?: string;
}

class ICMSSN {
  @IsOptional()
  @IsString()
  declare CSOSN?: string;

  @IsOptional()
  @IsString()
  declare item?: string;

  @IsOptional()
  @IsString()
  declare modBC?: string;

  @IsOptional()
  @IsString()
  declare modBCST?: string;

  @IsOptional()
  @IsString()
  declare orig?: string;

  @IsOptional()
  @IsString()
  declare pCredSN?: string;

  @IsOptional()
  @IsString()
  declare pFCPST?: string;

  @IsOptional()
  @IsString()
  declare pFCPSTRet?: string;

  @IsOptional()
  @IsString()
  declare pICMS?: string;

  @IsOptional()
  @IsString()
  declare pICMSEfet?: string;

  @IsOptional()
  @IsString()
  declare pICMSST?: string;

  @IsOptional()
  @IsString()
  declare pMVAST?: string;

  @IsOptional()
  @IsString()
  declare pRedBC?: string;

  @IsOptional()
  @IsString()
  declare pRedBCEfet?: string;

  @IsOptional()
  @IsString()
  declare pRedBCST?: string;

  @IsOptional()
  @IsString()
  declare pST?: string;

  @IsOptional()
  @IsString()
  declare vBC?: string;

  @IsOptional()
  @IsString()
  declare vBCEfet?: string;

  @IsOptional()
  @IsString()
  declare vBCFCPST?: string;

  @IsOptional()
  @IsString()
  declare vBCFCPSTRet?: string;

  @IsOptional()
  @IsString()
  declare vBCST?: string;

  @IsOptional()
  @IsString()
  declare vBCSTRet?: string;

  @IsOptional()
  @IsString()
  declare vCredICMSSN?: string;

  @IsOptional()
  @IsString()
  declare vFCPST?: string;

  @IsOptional()
  @IsString()
  declare vFCPSTRet?: string;

  @IsOptional()
  @IsString()
  declare vICMS?: string;

  @IsOptional()
  @IsString()
  declare vICMSEfet?: string;

  @IsOptional()
  @IsString()
  declare vICMSST?: string;

  @IsOptional()
  @IsString()
  declare vICMSSTRet?: string;

  @IsOptional()
  @IsString()
  declare vICMSSubstituto?: string;
}

class ICMSUFDest {
  @IsOptional()
  @IsString()
  declare item?: string;

  @IsOptional()
  @IsString()
  declare pFCPUFDest?: string;

  @IsOptional()
  @IsString()
  declare pICMSInter?: string;

  @IsOptional()
  @IsString()
  declare pICMSInterPart?: string;

  @IsOptional()
  @IsString()
  declare pICMSUFDest?: string;

  @IsOptional()
  @IsString()
  declare vBCFCPUFDest?: string;

  @IsOptional()
  @IsString()
  declare vBCUFDest?: string;

  @IsOptional()
  @IsString()
  declare vFCPUFDest?: string;

  @IsOptional()
  @IsString()
  declare vICMSUFDest?: string;

  @IsOptional()
  @IsString()
  declare vICMSUFRemet?: string;
}

class II {
  @IsOptional()
  @IsString()
  declare item?: string;

  @IsOptional()
  @IsString()
  declare vBC?: string;

  @IsOptional()
  @IsString()
  declare vDespAdu?: string;

  @IsOptional()
  @IsString()
  declare vII?: string;

  @IsOptional()
  @IsString()
  declare vIOF?: string;
}

class PISST {
  @IsOptional()
  @IsString()
  declare indSomaPISST?: string;

  @IsOptional()
  @IsString()
  declare item?: string;

  @IsOptional()
  @IsString()
  declare pPIS?: string;

  @IsOptional()
  @IsString()
  declare qBCProd?: string;

  @IsOptional()
  @IsString()
  declare vAliqProd?: string;

  @IsOptional()
  @IsString()
  declare vBC?: string;

  @IsOptional()
  @IsString()
  declare vPIS?: string;
}

class COFINS {
  @IsOptional()
  @IsString()
  declare CST?: string;

  @IsOptional()
  @IsString()
  declare item?: string;

  @IsOptional()
  @IsString()
  declare pCOFINS?: string;

  @IsOptional()
  @IsString()
  declare qBCProd?: string;

  @IsOptional()
  @IsString()
  declare vAliqProd?: string;

  @IsOptional()
  @IsString()
  declare vBC?: string;

  @IsOptional()
  @IsString()
  declare vCOFINS?: string;
}

class COFINSST {
  @IsOptional()
  @IsString()
  declare indSomaCOFINSST?: string;

  @IsOptional()
  @IsString()
  declare item?: string;

  @IsOptional()
  @IsString()
  declare pCOFINS?: string;

  @IsOptional()
  @IsString()
  declare qBCProd?: string;

  @IsOptional()
  @IsString()
  declare vAliqProd?: string;

  @IsOptional()
  @IsString()
  declare vBC?: string;

  @IsOptional()
  @IsString()
  declare vCOFINS?: string;
}

class ISSQN {
  @IsOptional()
  @IsString()
  declare cListServ?: string;

  @IsOptional()
  @IsString()
  declare cMun?: string;

  @IsOptional()
  @IsString()
  declare cMunFG?: string;

  @IsOptional()
  @IsString()
  declare cPais?: string;

  @IsOptional()
  @IsString()
  declare cServico?: string;

  @IsOptional()
  @IsString()
  declare indISS?: string;

  @IsOptional()
  @IsString()
  declare indIncentivo?: string;

  @IsOptional()
  @IsString()
  declare item?: string;

  @IsOptional()
  @IsString()
  declare nProcesso?: string;

  @IsOptional()
  @IsString()
  declare vAliq?: string;

  @IsOptional()
  @IsString()
  declare vBC?: string;

  @IsOptional()
  @IsString()
  declare vDeducao?: string;

  @IsOptional()
  @IsString()
  declare vDescCond?: string;

  @IsOptional()
  @IsString()
  declare vDescIncond?: string;

  @IsOptional()
  @IsString()
  declare vISSQN?: string;

  @IsOptional()
  @IsString()
  declare vISSRet?: string;

  @IsOptional()
  @IsString()
  declare vOutro?: string;
}

class ImpostoDevol {
  @IsOptional()
  @IsString()
  declare item?: string;

  @IsOptional()
  @IsString()
  declare pDevol?: string;

  @IsOptional()
  @IsString()
  declare vIPIDevol?: string;
}

class ISSQNTot {
  @IsOptional()
  @IsString()
  declare cRegTrib?: string;

  @IsOptional()
  @IsString() // TODO: talvez seja Date
  declare dCompet?: string;

  @IsOptional()
  @IsString()
  declare vBC?: string;

  @IsOptional()
  @IsString()
  declare vCOFINS?: string;

  @IsOptional()
  @IsString()
  declare vDeducao?: string;

  @IsOptional()
  @IsString()
  declare vDescCond?: string;

  @IsOptional()
  @IsString()
  declare vDescIncond?: string;

  @IsOptional()
  @IsString()
  declare vISS?: string;

  @IsOptional()
  @IsString()
  declare vISSRet?: string;

  @IsOptional()
  @IsString()
  declare vOutro?: string;

  @IsOptional()
  @IsString()
  declare vPIS?: string;

  @IsOptional()
  @IsString()
  declare vServ?: string;
}

class RetTrib {
  @IsOptional()
  @IsString()
  declare vBCIRRF?: string;

  @IsOptional()
  @IsString()
  declare vBCRetPrev?: string;

  @IsOptional()
  @IsString()
  declare vIRRF?: string;

  @IsOptional()
  @IsString()
  declare vRetCOFINS?: string;

  @IsOptional()
  @IsString()
  declare vRetCSLL?: string;

  @IsOptional()
  @IsString()
  declare vRetPIS?: string;

  @IsOptional()
  @IsString()
  declare vRetPrev?: string;
}

class Balsa {
  @IsOptional()
  @IsString()
  declare balsa?: string;
}

class Vol {
  @IsOptional()
  @IsString()
  declare esp?: string;

  @IsOptional()
  @IsString()
  declare item?: string;

  @IsOptional()
  @IsString()
  declare marca?: string;

  @IsOptional()
  @IsString()
  declare nVol?: string;

  @IsOptional()
  @IsString()
  declare pesoB?: string;

  @IsOptional()
  @IsString()
  declare pesoL?: string;

  @IsOptional()
  @IsString()
  declare qVol?: string;
}

class Pag {
  @IsOptional()
  @IsString()
  declare vTroco?: string;
}

class Intermed {
  @IsOptional()
  @IsString()
  declare CNPJ?: string;

  @IsOptional()
  @IsString()
  declare idCadIntTran?: string;
}

class Agropecuario {
  @IsOptional()
  @IsString()
  declare CPFRespTec?: string;

  @IsOptional()
  @IsString()
  declare UFGuia?: string;

  @IsOptional()
  @IsString()
  declare nGuia?: string;

  @IsOptional()
  @IsString()
  declare nReceituario?: string;

  @IsOptional()
  @IsString()
  declare serieGuia?: string;

  @IsOptional()
  @IsString()
  declare tpGuia?: string;
}
