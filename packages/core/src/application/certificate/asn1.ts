import type { CertificateInfo } from '@nfets/core/domain';
import type { X509Certificate } from 'node:crypto';

export class ASN1 {
  public extractCertificateInfo(certificate: X509Certificate) {
    const lines = certificate.subject.split('\n');
    const map = lines.reduce((map, line) => {
      const [key, value] = line.split('=').map((s) => s.trim());
      if (!key || !value) return map;
      return map.set(key, value);
    }, new Map<string, string>());

    const CPF = this.oid('2.16.76.1.3.1', certificate.raw);

    return {
      CNPJ: this.oid('2.16.76.1.3.3', certificate.raw),
      CPF: CPF,
      CN: map.get('CN'),
      O: map.get('O'),
      OU: map.get('OU'),
      ST: map.get('ST'),
      L: map.get('L'),
      C: map.get('C'),
    } satisfies CertificateInfo;
  }

  public oid(number: string, publicKey: Buffer) {
    const marker = this.marker(number);
    const index = publicKey.indexOf(marker);
    if (index === -1) return void 0;

    const parts = [publicKey.subarray(0, index), publicKey.subarray(index)];

    const tot = parts.length;
    if (tot <= 1) return void 0;

    const xcv4 = parts[0].subarray(-4);
    let xcv = xcv4.subarray(-2);

    if (xcv4[0] === 0x30) xcv = xcv4;
    else if (xcv4[1] === 0x30) xcv = xcv4.subarray(-3);

    const data = Buffer.concat([xcv, marker, parts[1]]);
    const len = this.length(data);

    const bytes = marker.length;
    const oid = data.subarray(2 + bytes, 2 + bytes + len);

    const head = oid.length - xcv.length - 2;
    if (head <= 0 || head > oid.length) return void 0;

    const sliced = oid.subarray(-head);
    const raw = sliced.toString('utf8');

    return raw.substring(
      Buffer.from(raw).findIndex(
        (_, i) => raw.charCodeAt(i) >= 0x20 && raw.charCodeAt(i) <= 0x7e,
      ),
    );
  }

  protected length(data: Buffer): number {
    if (data.length < 2) return 0;
    if (data[1] <= 127) return data[1];

    return Buffer.from([data[1] & 0x0f]).reduce(
      (len, byte) => (len << 8) | byte,
      0,
    );
  }

  protected marker(oid: string): Buffer {
    const parts = oid.split('.');

    const bin = parts.slice(2).reduce<number[]>((bytes, part) => {
      const result = this.base128(bytes, Number.parseInt(part, 10), true);
      return (bytes.length = 0), bytes.push(...result), bytes;
    }, []);

    return Buffer.from([
      0x06,
      bin.length + 1,
      40 * Number.parseInt(parts[0], 10) + Number.parseInt(parts[1], 10),
      ...bin,
    ]);
  }

  protected base128(bytes: number[], byte: number, last: boolean): number[] {
    const result = [...bytes];

    if (byte > 127) {
      const rest = this.base128(bytes, Math.floor(byte / 128), false);
      rest.length = 0;
      result.push(...rest);
    }

    const value = byte % 128;
    if (last) result.push(value);
    else result.push(0x80 | value);

    return result;
  }
}
