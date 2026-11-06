import { dateToolkit } from '@nfets/core';

export class DaeventoFormatter {
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
    return value.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  public phone(value?: string): string {
    if (!value) return '';
    const digits = value.replace(/\D/g, '');
    return digits.replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');
  }

  public number(nNF: string): string {
    return nNF.padStart(9, '0').replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
  }

  public serie(serie: string): string {
    return serie.padStart(3, '0');
  }

  public accessKey(chNFe: string): string {
    return chNFe.replace(/(.{4})/g, '$1 ').trim();
  }

  public dateTime(value?: string): string {
    if (!value) return '';
    return dateToolkit(value).format('DD/MM/YYYY HH:mm:ss');
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
