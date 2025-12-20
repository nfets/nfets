export const ensurePlatform = (
  name: typeof process.platform,
): true | undefined => {
  const platform = process.platform;

  if (platform !== name) {
    return it.skip(`test only for ${name} platform`, () => void 0), void 0;
  }

  return true;
};
