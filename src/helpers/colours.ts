import { platformMapping } from '@/variables/mappings';
import { getRndInteger } from './random';
import { maxColourValue, minColourValue } from '@/variables/colour';
import type { PlatformLabels } from '@/types/data';

export function setPlatformColours(platformLabelArray: PlatformLabels[]) {
  const platformMappingObjectValues = Object.values(platformMapping);
  return platformLabelArray.map(
    (platform) => platformMappingObjectValues.find((item) => item.label === platform)?.colour ?? ''
  );
}

export function getRandomColour() {
  const rgb = Array.from({ length: 3 }).map(() => getRndInteger(minColourValue, maxColourValue));
  const hexCode = rgb.map((colour) => colour.toString(16)).join('');
  return `#${hexCode}`;
}
