export const invertSwitches = <T>(currentSwitches: T[], allSwitches: T[]) =>
  Object.values(allSwitches).filter((item) => !currentSwitches.includes(item));
