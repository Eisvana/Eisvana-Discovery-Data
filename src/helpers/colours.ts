import type { ValueOf } from '@/types/data';
import { platformColours, platformMapping } from '@/variables/mappings';

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
  return '#' + Math.floor(Math.random() * 16777215).toString(16); // NoSonar I have no idea what these numbers are...
}
