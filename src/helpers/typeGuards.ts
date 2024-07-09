import type { DiscoveryData } from '@/types/data';
import type { Platform } from '@/types/platform';
import { platformCodes } from '@/variables/platforms';

export const isPlatformCode = (code: unknown): code is Platform =>
  typeof code === 'string' && platformCodes.includes(code);

export const isObject = (item: unknown): item is object => Boolean(item) && typeof item === 'object';

// this runs in a web worker and must not use any quasar dependencies, that's why we're using our own isObject() function here
export function isDiscoveryData(item: unknown): item is DiscoveryData {
  if (!isObject(item)) return false;
  return 'Name' in item && 'Glyphs' in item && 'Discoverer' in item && 'Platform' in item && 'Timestamp' in item;
}
