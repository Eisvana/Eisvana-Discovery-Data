import type { ValueOf } from '@/types/utility';
import { platformColours, platformMapping } from '@/variables/mappings';
import { getRndInteger } from './random';
import { maxColourValue, minColourValue } from '@/variables/colour';

export function setPlatformColours(array: ValueOf<typeof platformMapping>[]) {
  return array.map((platform) => {
    const platformColourLookup = {
      [platformMapping.ST]: platformColours.steam,
      [platformMapping.PS]: platformColours.ps,
      [platformMapping.XB]: platformColours.xb,
      [platformMapping.GX]: platformColours.gog,
      [platformMapping.NI]: platformColours.switch,
    };

    return platformColourLookup[platform];
  });
}

export function getRandomColour() {
  const rgb = Array.from({ length: 3 }).map(() => getRndInteger(minColourValue, maxColourValue));
  const hexCode = rgb.map((colour) => colour.toString(16)).join('');
  return `#${hexCode}`;
}
