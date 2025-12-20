import { arch, platform } from 'node:os';
import { existsSync } from 'node:fs';
import { addon } from '@nfets/core/shared/addon';

jest.mock('node:os', () => ({
  arch: jest.fn(),
  platform: jest.fn(),
}));

jest.mock('node:fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('@nfets/core/shared/resolve-requires', () => ({
  getCurrentFile: jest.fn(() => '/mock/current/file.ts'),
  getRequireFn: jest.fn(() => (path: string) => {
    return { path, loaded: true };
  }),
}));

const resolveAddonName = (name: string) => {
  const os = jest.requireActual('node:os');
  if (os.platform() === 'win32') return name.replace(/\//g, '\\');
  return name;
};

describe('addon (unit)', () => {
  const mockArch = arch as jest.MockedFunction<typeof arch>;
  const mockPlatform = platform as jest.MockedFunction<typeof platform>;
  const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockExistsSync.mockReturnValue(false);

    delete process.env.NFETS_ADDONS_DIR;
  });

  describe('supported platform + arch combinations', () => {
    it('should successfully load addon for darwin + arm64', () => {
      mockPlatform.mockReturnValue('darwin');
      mockArch.mockReturnValue('arm64');
      mockExistsSync.mockReturnValue(true);

      const result = addon('test-addon');

      expect(result).toEqual({
        path: expect.stringContaining(
          resolveAddonName('darwin-arm64/test-addon.node'),
        ),
        loaded: true,
      });
      expect(mockPlatform).toHaveBeenCalled();
      expect(mockArch).toHaveBeenCalled();
    });

    it('should successfully load addon for linux + x64', () => {
      mockPlatform.mockReturnValue('linux');
      mockArch.mockReturnValue('x64');
      mockExistsSync.mockReturnValue(true);

      const result = addon('test-addon');

      expect(result).toEqual({
        path: expect.stringContaining(
          resolveAddonName('linux-x64/test-addon.node'),
        ),
        loaded: true,
      });
      expect(mockPlatform).toHaveBeenCalled();
      expect(mockArch).toHaveBeenCalled();
    });

    it('should successfully load addon for win32 + x64', () => {
      mockPlatform.mockReturnValue('win32');
      mockArch.mockReturnValue('x64');
      mockExistsSync.mockReturnValue(true);

      const result = addon('test-addon');

      expect(result).toEqual({
        path: expect.stringContaining(
          resolveAddonName('win32-x64/test-addon.node'),
        ),
        loaded: true,
      });
      expect(mockPlatform).toHaveBeenCalled();
      expect(mockArch).toHaveBeenCalled();
    });
  });

  describe('unsupported platform + arch combinations', () => {
    const unsupportedCombinations = [
      { platform: 'darwin', arch: 'x64' },
      { platform: 'darwin', arch: 'arm' },
      { platform: 'darwin', arch: 'ia32' },
      { platform: 'darwin', arch: 'mips' },
      { platform: 'darwin', arch: 'ppc' },
      { platform: 'darwin', arch: 'ppc64' },
      { platform: 'darwin', arch: 's390' },
      { platform: 'darwin', arch: 's390x' },
      { platform: 'darwin', arch: 'x32' },
      { platform: 'darwin', arch: 'mipsel' },

      { platform: 'linux', arch: 'arm64' },
      { platform: 'linux', arch: 'arm' },
      { platform: 'linux', arch: 'ia32' },
      { platform: 'linux', arch: 'mips' },
      { platform: 'linux', arch: 'ppc' },
      { platform: 'linux', arch: 'ppc64' },
      { platform: 'linux', arch: 's390' },
      { platform: 'linux', arch: 's390x' },
      { platform: 'linux', arch: 'x32' },
      { platform: 'linux', arch: 'mipsel' },

      { platform: 'win32', arch: 'arm64' },
      { platform: 'win32', arch: 'arm' },
      { platform: 'win32', arch: 'ia32' },
      { platform: 'win32', arch: 'mips' },
      { platform: 'win32', arch: 'ppc' },
      { platform: 'win32', arch: 'ppc64' },
      { platform: 'win32', arch: 's390' },
      { platform: 'win32', arch: 's390x' },
      { platform: 'win32', arch: 'x32' },
      { platform: 'win32', arch: 'mipsel' },

      { platform: 'aix', arch: 'x64' },
      { platform: 'aix', arch: 'arm64' },
      { platform: 'aix', arch: 'ppc' },
      { platform: 'aix', arch: 'ppc64' },
      { platform: 'freebsd', arch: 'x64' },
      { platform: 'freebsd', arch: 'arm64' },
      { platform: 'freebsd', arch: 'arm' },
      { platform: 'openbsd', arch: 'x64' },
      { platform: 'openbsd', arch: 'arm64' },
      { platform: 'sunos', arch: 'x64' },
      { platform: 'sunos', arch: 'sparc' },
    ];

    unsupportedCombinations.forEach(({ platform: plat, arch: archValue }) => {
      it(`should throw error for unsupported combination: ${plat} + ${archValue}`, () => {
        mockPlatform.mockReturnValue(plat as NodeJS.Platform);
        mockArch.mockReturnValue(archValue as NodeJS.Architecture);
        mockExistsSync.mockReturnValue(false);

        expect(() => {
          addon('test-addon');
        }).toThrow(`Addon ${plat}-${archValue}/test-addon.node not found`);

        expect(mockPlatform).toHaveBeenCalled();
        expect(mockArch).toHaveBeenCalled();
        expect(mockExistsSync).toHaveBeenCalled();
      });
    });
  });

  describe('environment variable NFETS_ADDONS_DIR', () => {
    const originalEnv = process.env.NFETS_ADDONS_DIR;

    afterEach(() => {
      if (originalEnv === undefined) {
        delete process.env.NFETS_ADDONS_DIR;
      } else {
        process.env.NFETS_ADDONS_DIR = originalEnv;
      }
    });

    it('should use NFETS_ADDONS_DIR when set for supported platform', () => {
      process.env.NFETS_ADDONS_DIR = '/custom/addons/dir';
      mockPlatform.mockReturnValue('darwin');
      mockArch.mockReturnValue('arm64');

      const result = addon('test-addon');

      expect(result).toEqual({
        path: expect.stringContaining(
          resolveAddonName('/custom/addons/dir/test-addon.node'),
        ),
        loaded: true,
      });
      expect(mockExistsSync).not.toHaveBeenCalled();
    });
  });

  describe('file search logic', () => {
    it('should search in build/addons directory first', () => {
      mockPlatform.mockReturnValue('linux');
      mockArch.mockReturnValue('x64');

      mockExistsSync.mockReturnValueOnce(false).mockReturnValueOnce(true);

      const result = addon('test-addon');

      expect(result).toEqual({
        path: expect.stringContaining(
          resolveAddonName('linux-x64/test-addon.node'),
        ),
        loaded: true,
      });
      expect(mockExistsSync.mock.calls.length).toBeGreaterThanOrEqual(2);
    });

    it('should search in node_modules/nfets/build/addons as fallback', () => {
      mockPlatform.mockReturnValue('win32');
      mockArch.mockReturnValue('x64');

      let callCount = 0;
      mockExistsSync.mockImplementation(() => {
        return ++callCount >= 6;
      });

      const result = addon('test-addon');

      expect(result).toEqual({
        path: expect.stringContaining(
          resolveAddonName('win32-x64/test-addon.node'),
        ),
        loaded: true,
      });

      expect(mockExistsSync).toHaveBeenCalled();
    });
  });
});
