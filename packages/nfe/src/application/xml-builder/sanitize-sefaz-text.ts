import { StateCodes } from '@nfets/core/domain';
import { Decimal } from '@nfets/core/infrastructure';

const SEFAZ_STRIP_ACCENT_UFS = ['MT'] as const;
const SEFAZ_STRIP_ACCENT_CUFS = [StateCodes.MT] as const;

const ACCENT_REPLACEMENTS: readonly [RegExp, string][] = [
  [/[áàâãªä]/g, 'a'],
  [/[ÁÀÂÃÄ]/g, 'A'],
  [/[ÍÌÎÏ]/g, 'I'],
  [/[íìîï]/g, 'i'],
  [/[éèêë]/g, 'e'],
  [/[ÉÈÊË]/g, 'E'],
  [/[óòôõºö]/g, 'o'],
  [/[ÓÒÔÕÖ]/g, 'O'],
  [/[úùûü]/g, 'u'],
  [/[ÚÙÛÜ]/g, 'U'],
  [/ç/g, 'c'],
  [/Ç/g, 'C'],
  [/ñ/g, 'n'],
  [/Ñ/g, 'N'],
];

export function shouldStripSefazAccents(
  ufOrCuf: string | null | undefined,
): boolean {
  if (!ufOrCuf) return false;
  const normalized = ufOrCuf.toUpperCase();
  return (
    (SEFAZ_STRIP_ACCENT_UFS as readonly string[]).includes(normalized) ||
    (SEFAZ_STRIP_ACCENT_CUFS as readonly string[]).includes(normalized)
  );
}

export function replaceSefazSpecialChars(value: string): string {
  return ACCENT_REPLACEMENTS.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    value,
  );
}

export function sanitizeSefazText<T>(
  value: T,
  ufOrCuf: string | null | undefined,
): T {
  if (!shouldStripSefazAccents(ufOrCuf)) return value;
  return walk(value);
}

function isWalkableObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  if (value instanceof Date || value instanceof Decimal) return false;
  return !ArrayBuffer.isView(value);
}

function walk<T>(value: T): T {
  if (typeof value === 'string') return replaceSefazSpecialChars(value) as T;
  if (Array.isArray(value)) {
    const sanitized: unknown[] = value.map((item: unknown) => walk(item));
    return sanitized as T;
  }
  if (!isWalkableObject(value)) return value;

  const result: Record<string, unknown> = {};
  for (const [key, nested] of Object.entries(value)) {
    result[key] = walk(nested);
  }
  return result as T;
}
