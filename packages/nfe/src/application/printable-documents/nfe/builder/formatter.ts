import {
  Decimal,
  dateToolkit,
  timezones,
  type DecimalValue,
} from '@nfets/core';
import type { DanfePdfDocument } from '../danfe';

export class DanfeFormatter {
  public constructor(private readonly context: DanfePdfDocument) {}

  public isNotEmpty(value?: DecimalValue): value is DecimalValue {
    return !!value && Number.parseFloat(value.toString()) > 0;
  }

  public decimal(
    value?: DecimalValue,
    minimumFractionDigits = 2,
    maximumFractionDigits = minimumFractionDigits,
  ): string {
    return new Decimal(value ?? 0).toNumber().toLocaleString('pt-BR', {
      minimumFractionDigits,
      maximumFractionDigits,
    });
  }

  public currency(value?: DecimalValue): string {
    return this.decimal(value, 2);
  }

  public percent(value?: DecimalValue): string {
    return `${this.decimal(value, 2, 4)}%`;
  }

  public document(cnpj?: string, cpf?: string): string {
    if (cnpj?.length === 14)
      return cnpj.replace(
        /([A-Z0-9]{2})([A-Z0-9]{3})([A-Z0-9]{3})([A-Z0-9]{4})([A-Z0-9]{2})/,
        '$1.$2.$3/$4-$5',
      );
    if (cpf?.length === 11)
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    return cnpj ?? cpf ?? '';
  }

  public cep(value?: string): string {
    if (!value) return '';
    return value.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  public phone(value?: string): string {
    if (!value) return '';
    return value.replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');
  }

  public number(nNF: string): string {
    return nNF.padStart(9, '0').replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
  }

  public serie(serie: string): string {
    return serie.padStart(3, '0');
  }

  public accessKey(): string {
    return this.accessKeyDigits()
      .replace(/(.{4})/g, '$1 ')
      .trim();
  }

  public accessKeyDigits(): string {
    const { Id } = this.context.data.infNFe.$;
    return (Id ?? '').replace(/^NFe/, '');
  }

  protected tz(value: string) {
    const { cUF } = this.context.data.infNFe.ide;
    return dateToolkit(value).tz(timezones[cUF]);
  }

  public date(value?: string): string {
    if (!value) return '';
    return this.tz(value).format('DD/MM/YYYY');
  }

  public time(value?: string): string {
    if (!value) return '';
    return this.tz(value).format('HH:mm:ss');
  }

  public dateTime(value?: string): string {
    if (!value) return '';
    return this.tz(value).format('DD/MM/YYYY HH:mm:ss');
  }

  public plainDate(value?: string): string {
    if (!value) return '';
    const [year, month, day] = value.substring(0, 10).split('-');
    return `${day}/${month}/${year}`;
  }

  public now(): string {
    return dateToolkit().format('DD/MM/YYYY [às] HH:mm:ss');
  }

  public sanitize(value?: string): string {
    return (
      (value ?? '')
        // eslint-disable-next-line no-control-regex
        .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '')
        .trim()
    );
  }
}
