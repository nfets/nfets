import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Check if we're in Jest (ts-jest transforms code and import.meta.url causes syntax errors)
const isJest =
  typeof jest !== 'undefined' || process.env.JEST_WORKER_ID !== undefined;

// Helper to get import.meta.url - only used outside of Jest
// In Jest, we avoid using import.meta.url entirely to prevent syntax errors
// We use a Function constructor to dynamically access import.meta.url
// This prevents the Jest transformer from seeing the import.meta syntax
let cachedImportMetaUrl: string | undefined;
const getImportMetaUrl = (): string | undefined => {
  if (cachedImportMetaUrl !== undefined) {
    return cachedImportMetaUrl;
  }
  if (isJest) {
    cachedImportMetaUrl = undefined;
    return undefined;
  }
  // Use Function constructor to dynamically access import.meta.url
  // This prevents Jest's transformer from parsing import.meta syntax
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const getMetaUrl = new Function(
      'try { return import.meta.url; } catch { return undefined; }',
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    cachedImportMetaUrl = getMetaUrl() as string | undefined;
  } catch {
    cachedImportMetaUrl = undefined;
  }
  return cachedImportMetaUrl;
};

// Create a require function that works in both ESM and CJS
export const getRequireFn = () => {
  if (typeof require !== 'undefined') return require;

  const importMetaUrl = getImportMetaUrl();
  if (importMetaUrl) return createRequire(importMetaUrl);

  // Fallback for Jest: create require from a file URL based on process.cwd()
  // This allows require to work even when import.meta.url is unavailable
  const fallbackUrl = pathToFileURL(
    resolve(process.cwd(), 'package.json'),
  ).href;

  return createRequire(fallbackUrl);
};

export const getCurrentFile = (): string => {
  if (typeof __filename !== 'undefined') return __filename;

  const importMetaUrl = getImportMetaUrl();
  if (importMetaUrl) return fileURLToPath(importMetaUrl);

  // Fallback for Jest: start search from project root
  // We'll search upward from process.cwd() to find the build directory
  return resolve(process.cwd());
};
