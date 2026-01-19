import { join, dirname, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { getCurrentFile } from './resolve-requires';

interface ElectronProcess extends NodeJS.Process {
  resourcesPath?: string;
}

const isElectron = (): boolean => {
  return (
    typeof process !== 'undefined' &&
    typeof process.versions !== 'undefined' &&
    'electron' in process.versions
  );
};

const getElectronApp = (): { getAppPath: () => string } | null => {
  if (!isElectron()) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const electron = require('electron') as {
      app?: { getAppPath?: () => string };
    };
    const app = electron.app;
    if (app?.getAppPath && typeof app.getAppPath === 'function') {
      return { getAppPath: app.getAppPath };
    }
  } catch {
    // Electron app not available or not main process
  }

  return null;
};

const getElectronResourcesPath = (): string | null => {
  if (!isElectron()) return null;

  const electronProcess = process as ElectronProcess;

  // In Electron, process.resourcesPath points to the resources directory
  // where extraResources files are placed (outside ASAR)
  if (electronProcess.resourcesPath) return electronProcess.resourcesPath;

  const app = getElectronApp();
  if (app) {
    try {
      const appPath = app.getAppPath();
      if (typeof appPath === 'string') return dirname(appPath.replace(/\.asar$/, ''));
    } catch {
      // getAppPath failed
    }
  }

  return null;
};

export const search = <T>(target: string, { onFound, onNotFound }: { onFound: (path: string) => T, onNotFound: () => void }): T => {

  const resources = getElectronResourcesPath();
  if (resources) {
    const electronCandidate = join(
      resources,
      'node_modules',
      'nfets',
      target
    );

    if (existsSync(electronCandidate)) {
      return onFound(electronCandidate);
    }
  }

  const current = getCurrentFile();

  const base = current.includes('.asar') ? process.cwd() : current;

  const root = resolve(base, '../../../../');
  const build = join(root, target);

  if (existsSync(build)) return onFound(build);

  // distribution
  let search = base;
  for (let i = 0; i < 5; i++) {
    const candidate = join(search, target);
    if (existsSync(candidate)) return onFound(candidate);

    const parent = dirname(search);
    if (parent === search) break;
    search = parent;
  }

  // distribution fallback
  search = base;
  for (let i = 0; i < 5; i++) {
    const candidate = join(
      search,
      'node_modules',
      'nfets',
      target,
    );

    if (existsSync(candidate)) return onFound(candidate);

    const parent = dirname(search);
    if (parent === search) break;
    search = parent;
  }

  // dev-time
  search = base;
  for (let i = 0; i < 5; i++) {
    const candidate = join(search, target.replace(/^build\//, 'Release/'));
    if (existsSync(candidate)) return onFound(candidate);

    const parent = dirname(search);
    if (parent === search) break;
    search = parent;
  }

  return onNotFound() as never;
}
