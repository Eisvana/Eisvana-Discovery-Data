export const invertSwitches = (currentSwitches: string[], allSwitches: string[]) =>
  Object.values(allSwitches).filter((item) => !currentSwitches.includes(item));
