import type { DiscoveryData } from '@/types/data';
import type { Platform } from '@/types/platform';

export function isPlatformCode(code: unknown): code is Platform {
  const platformCodes = ['GX', 'NI', 'PS', 'ST', 'XB'];
  return typeof code === 'string' && platformCodes.includes(code);
}

export function isObject(item: unknown): item is object {
  return Boolean(item) && typeof item === 'object';
}

export function isDiscoveryData(item: unknown): item is DiscoveryData {
  if (!isObject(item)) return false;
  return 'Name' in item && 'Glyphs' in item && 'Discoverer' in item && 'Platform' in item && 'Timestamp' in item;
}
