import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';

const distPath = path.resolve('dist');

type Package = {
  name: string;
  version: string;
  path: string;
  private: boolean;
};

function getPackages(): string[] {
  try {
    const output = execSync('pnpm -r ls --depth -1 --json', {
      encoding: 'utf-8',
    });
    const packageList = JSON.parse(output) as Package[];

    return packageList
      .filter((pkg) => pkg.path.includes('packages'))
      .map((pkg) => path.basename(pkg.path));
  } catch (error) {
    console.error('Error fetching package list:', error);
    return [];
  }
}

async function copyDir(src: string, dest: string): Promise<void> {
  await fs.ensureDir(dest);
  await fs.copy(src, dest);
}

async function buildPackage(packageName: string): Promise<void> {
  const packagePath = path.resolve('packages', packageName);
  console.log(`🛠️ Building package: ${packageName}`);
  execSync(`make build:${packageName}`, { stdio: 'inherit' });
  const outDir = path.resolve(distPath, packageName);
  await copyDir(path.join(packagePath, 'dist/src'), outDir);
}

async function buildAll(): Promise<void> {
  const packages = getPackages();

  if (packages.length === 0) {
    console.error('No packages found to build.');
    return;
  }

  await fs.remove(distPath);
  await fs.ensureDir(distPath);

  for (const packageName of packages) {
    await buildPackage(packageName);
  }

  console.log('Build completed successfully!');
}

buildAll().catch((err: unknown) => {
  console.error('Build failed:', err);
});
