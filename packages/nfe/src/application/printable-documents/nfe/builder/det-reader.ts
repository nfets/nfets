import { Decimal } from '@nfets/core';
import type { DecimalValue } from '@nfets/core/domain';
import type { Det } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det';
import type { IPITrib } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ipi';
import type { GIBSCBS } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/gibscbs';
import type { IS } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/is';

export interface DetIcmsValues {
  orig?: string;
  CST?: string;
  CSOSN?: string;
  vBC?: DecimalValue;
  pICMS?: DecimalValue;
  vICMS?: DecimalValue;
  vBCFCP?: DecimalValue;
  pFCP?: DecimalValue;
  vFCP?: DecimalValue;
  pRedBC?: DecimalValue;
  pMVAST?: DecimalValue;
  pICMSST?: DecimalValue;
  vBCST?: DecimalValue;
  vICMSST?: DecimalValue;
  vBCFCPST?: DecimalValue;
  pFCPST?: DecimalValue;
  vFCPST?: DecimalValue;
  vBCSTRet?: DecimalValue;
  pST?: DecimalValue;
  vICMSSubstituto?: DecimalValue;
  vICMSSTRet?: DecimalValue;
}

export class DetReader {
  public constructor(public readonly det: Det) {}

  public get icms(): DetIcmsValues {
    const group = this.det.imposto?.ICMS;
    if (!group) return {};
    const [values] = Object.values(group) as (DetIcmsValues | undefined)[];
    return values ?? {};
  }

  public get cstCode(): string {
    const { CST, CSOSN } = this.icms;
    return CSOSN ?? CST ?? '';
  }

  public cst(separator = ''): string {
    const { orig } = this.icms;
    const code = this.cstCode;
    if (orig === undefined) return code;
    return `${orig}${separator}${code}`;
  }

  public get ipi(): IPITrib | undefined {
    return this.det.imposto?.IPI?.IPITrib;
  }

  public get ibscbs(): GIBSCBS | undefined {
    return this.det.imposto?.IBSCBS?.gIBSCBS;
  }

  public get cClassTrib(): string | undefined {
    return this.det.imposto?.IBSCBS?.cClassTrib;
  }

  public get is(): IS | undefined {
    return this.det.imposto?.IS;
  }

  public get hasTaxUnit(): boolean {
    const { uTrib, qTrib, vUnCom, vUnTrib } = this.det.prod;
    const fixed = (value?: DecimalValue) => new Decimal(value ?? 0).toFixed(2);
    return !!uTrib && !!qTrib && fixed(vUnCom) !== fixed(vUnTrib);
  }
}
