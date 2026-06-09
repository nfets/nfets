const UTF8_MOJIBAKE_PATTERN = /Ã[\u0080-\u00BF]/;

export function fixUtf8Mojibake(value: string): string {
  if (!UTF8_MOJIBAKE_PATTERN.test(value)) return value;

  const fixed = Buffer.from(value, 'latin1').toString('utf8');
  if (fixed.includes('\uFFFD')) return value;

  return fixed;
}

function normalizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return fixUtf8Mojibake(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeValue(item));
  }

  if (value !== null && typeof value === 'object') {
    const normalized: Record<string, unknown> = {};

    for (const [key, item] of Object.entries(value)) {
      normalized[key] = normalizeValue(item);
    }

    return normalized;
  }

  return value;
}

export function normalizeTransmissionStrings<T>(value: T): T {
  return normalizeValue(value) as T;
}
