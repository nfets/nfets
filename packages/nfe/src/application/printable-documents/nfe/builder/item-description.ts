import type { DecimalValue } from '@nfets/core/domain';
import type { Det } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det';
import type { ICMSUFDest } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/icmsufdest';
import type { DanfePdfDocument } from '../danfe';

import { DetReader, type DetIcmsValues } from './det-reader';

type Labels = Partial<Record<string, string>>;

export class ItemDescription {
  protected readonly maxAdditionalInfo = 500;

  protected readonly icmsTaxes: [keyof DetIcmsValues, string][] = [
    ['vBCFCP', ' BcFcp=%s'],
    ['pFCP', ' pFcp=%s%'],
    ['vFCP', ' vFcp=%s'],
    ['pRedBC', ' pRedBC=%s%'],
    ['pMVAST', ' IVA/MVA=%s%'],
    ['pICMSST', ' pIcmsSt=%s%'],
    ['vBCST', ' BcIcmsSt=%s'],
    ['vICMSST', ' vIcmsSt=%s'],
    ['vBCFCPST', ' BcFcpSt=%s'],
    ['pFCPST', ' pFcpSt=%s%'],
    ['vFCPST', ' vFcpSt=%s'],
    ['vBCSTRet', ' Retido na compra: BASE ICMS ST=%s'],
    ['pST', ' pSt=%s'],
    ['vICMSSubstituto', ' vICMSSubstituto=%s'],
    ['vICMSSTRet', ' VALOR ICMS ST=%s'],
  ];

  protected readonly icmsUfDestTaxes: [keyof ICMSUFDest, string][] = [
    ['pFCPUFDest', ' pFCPUFDest=%s%'],
    ['pICMSUFDest', ' pICMSUFDest=%s%'],
    ['pICMSInterPart', ' pICMSInterPart=%s%'],
    ['vFCPUFDest', ' vFCPUFDest=%s'],
    ['vICMSUFDest', ' vICMSUFDest=%s'],
    ['vICMSUFRemet', ' vICMSUFRemet=%s'],
  ];

  protected readonly operations: Labels = {
    0: 'OUTROS',
    1: 'VENDA CONCESSIONÁRIA',
    2: 'FATURAMENTO DIRETO CONSUMIDOR',
    3: 'VENDA DIRETA GDE CONSUMIDORES',
  };

  protected readonly fuels: Labels = {
    1: 'ALCOOL',
    2: 'GASOLINA',
    3: 'DIESEL',
    4: 'GASOGENIO',
    5: 'GAS METANO',
    6: 'ELETRICO/INTERNA',
    7: 'ELETRICO/EXTERNA',
    8: 'GASOL/GNC',
    9: 'ALCOOL/GNC',
    10: 'DIESEL/GNC',
    11: 'OBSERVACAO',
    12: 'ALCOOL/GNV',
    13: 'GASOLINA/GNV',
    14: 'DIESEL/GNV',
    15: 'GNV',
    16: 'ALCOOL/GASOLINA',
    17: 'GASOLINA/ALCOOL/GNV',
    18: 'GASOLINA/ELETRICO',
  };

  protected readonly species: Labels = {
    1: 'PASSAGEIRO',
    2: 'CARGA',
    3: 'MISTO',
    4: 'CORRIDA',
    5: 'TRACAO',
    6: 'ESPECIAL',
    7: 'COLECAO',
  };

  protected readonly vehicles: Labels = {
    2: 'CICLOMOTO',
    3: 'MOTONETA',
    4: 'MOTOCICLO',
    5: 'TRICICLO',
    6: 'AUTOMÓVEL',
    7: 'MICRO-ÔNIBUS',
    8: 'ÔNIBUS',
    10: 'REBOQUE',
    11: 'SEMIRREBOQUE',
    13: 'CAMIONETA',
    14: 'CAMINHÃO',
    17: 'CAMINHÃO TRATOR',
    18: 'TRATOR RODAS',
    19: 'TRATOR ESTEIRAS',
    20: 'TRATOR MISTO',
    21: 'QUADRICICLO',
    22: 'ESP/ÔNIBUS',
    23: 'CAMINHONETE',
    24: 'CARGA/CAM',
    25: 'UTILITÁRIO',
    26: 'MOTOR-CASA',
  };

  protected readonly colors: Labels = {
    1: 'AMARELO',
    2: 'AZUL',
    3: 'BEGE',
    4: 'BRANCA',
    5: 'CINZA',
    6: 'DOURADA',
    7: 'GRENA',
    8: 'LARANJA',
    9: 'MARROM',
    10: 'PRATA',
    11: 'PRETA',
    12: 'ROSA',
    13: 'ROXA',
    14: 'VERDE',
    15: 'VERMELHA',
    16: 'FANTASIA',
  };

  protected readonly conditions: Labels = {
    1: 'ACABADO',
    2: 'INACABADO',
    3: 'SEMI-ACABADO',
  };

  protected readonly restrictions: Labels = {
    0: 'NÃO HÁ',
    1: 'ALIENAÇÃO FIDUCIÁRIA',
    2: 'ARRENDAMENTO MERCANTIL',
    3: 'RESERVA DE DOMÍNIO',
    4: 'PENHOR DE VEÍCULOS',
    9: 'OUTRAS',
  };

  protected readonly weaponTypes: Labels = {
    0: 'USO PERMITIDO',
    1: 'USO RESTRITO',
  };

  public constructor(private readonly context: DanfePdfDocument) {}

  protected get options() {
    return this.context.options;
  }

  protected tax(value: DecimalValue | undefined, template: string): string {
    if (value === undefined || value === '' || value === '0') return '';
    return template.replace('%s', this.context.format.decimal(value, 2));
  }

  protected taxes(det: Det): string {
    const icms = new DetReader(det).icms;
    const icmsUfDest = det.imposto?.ICMSUFDest;
    return [
      ...this.icmsTaxes.map(([key, template]) => this.tax(icms[key], template)),
      ...(icmsUfDest
        ? this.icmsUfDestTaxes.map(([key, template]) =>
            this.tax(icmsUfDest[key], template),
          )
        : []),
    ].join('');
  }

  protected additionalInfo(det: Det): string {
    const infAdProd = det.infAdProd
      ?.substring(0, this.maxAdditionalInfo)
      .trim();
    return infAdProd ? `${infAdProd} ` : '';
  }

  protected anvisa(det: Det): string {
    const cProdANVISA = det.prod.med?.cProdANVISA;
    if (!this.options.showItemBatch || !cProdANVISA) return '';
    return `ANVISA: ${cProdANVISA}`;
  }

  protected batch(det: Det): string {
    const rastro = this.context.asArray(det.prod.rastro);
    if (!this.options.showItemBatch || rastro.length !== 1) return '';

    const [{ nLote, qLote, dFab, dVal }] = rastro;
    const { format } = this.context;
    return [
      nLote ? ` Lote: ${nLote}` : '',
      qLote ? ` Quant: ${qLote.toString()}` : '',
      ` Fab: ${format.plainDate(dFab)}`,
      ` Val: ${format.plainDate(dVal)} `,
    ].join('');
  }

  protected fci(det: Det): string {
    return det.prod.nFCI ? ` FCI:${det.prod.nFCI}` : '';
  }

  protected label(labels: Labels, code: string): string {
    return `${code}-${labels[Number.parseInt(code, 10)] ?? ''}`;
  }

  protected lines(entries: [string, string | undefined][]): string {
    return entries
      .map(([label, value]) => `${label}: ${value ?? ''}`)
      .join('\n');
  }

  public vehicle(det: Det): string {
    const veic = det.prod.veicProd;
    if (!veic) return '';

    return this.lines([
      ['TIPO DA OPERAÇÃO', this.label(this.operations, veic.tpOp)],
      ['CHASSI', veic.chassi],
      ['CÓDIGO DA COR', veic.cCor],
      ['NOME DA COR', veic.xCor],
      ['POTÊNCIA DO MOTOR', veic.pot],
      ['CILINDRADAS', veic.cilin],
      ['PESO LÍQUIDO', veic.pesoL],
      ['PESO BRUTO', veic.pesoB],
      ['NÚMERO DE SÉRIE', veic.nSerie],
      ['COMBUSTÍVEL', this.label(this.fuels, veic.tpComb)],
      ['NÚMERO DO MOTOR', veic.nMotor],
      ['CAP. MÁX. TRAÇÃO', veic.CMT],
      ['DISTÂNCIA ENTRE EIXOS', veic.dist],
      ['ANO DO MODELO', veic.anoMod],
      ['ANO DE FABRICAÇÃO', veic.anoFab],
      ['TIPO DE PINTURA', veic.tpPint],
      ['TIPO DE VEÍCULO', this.label(this.vehicles, veic.tpVeic)],
      ['ESPÉCIE DO VEÍCULO', this.label(this.species, veic.espVeic)],
      ['VIN (CHASSI)', veic.VIN === 'N' ? 'N-NORMAL' : 'R-REMARCADO'],
      ['CONDIÇÃO DO VEÍCULO', this.label(this.conditions, veic.condVeic)],
      ['CÓDIGO MARCA MODELO', veic.cMod],
      ['CÓDIGO COR DENATRAN', this.label(this.colors, veic.cCorDENATRAN)],
      ['CAPACIDADE MÁXIMA DE LOTAÇÃO', veic.lota],
      ['RESTRIÇÃO', `${veic.tpRest}-${this.restrictions[veic.tpRest] ?? ''}`],
    ]);
  }

  public weapons(det: Det): string {
    return this.context
      .asArray(det.prod.arma)
      .map((arma) =>
        this.lines([
          ['TIPO DA ARMA', this.label(this.weaponTypes, arma.tpArma)],
          ['NÚMERO DE SÉRIE DA ARMA', arma.nSerie],
          ['NÚMERO DE SÉRIE DO CANO', arma.nCano],
          ['DESCRIÇÃO DA ARMA', arma.descr],
        ]),
      )
      .join('\n');
  }

  public build(det: Det): string {
    const { prod } = det;
    const complement = this.options.showItemComplement
      ? this.batch(det) + this.taxes(det) + this.fci(det)
      : '';
    const additional = (
      this.additionalInfo(det) +
      this.anvisa(det) +
      complement
    ).trimEnd();

    let text = additional ? `${prod.xProd}\n    ${additional}` : prod.xProd;
    if (this.options.breakItemDescription) text = text.replaceAll(';', '\n');
    if (this.options.showItemOrderNumber && prod.nItemPed)
      text += ` (ITEM ${prod.nItemPed})`;

    return [text, this.vehicle(det), this.weapons(det)]
      .filter(Boolean)
      .join('\n');
  }
}
