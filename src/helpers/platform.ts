import type { Platform } from '@/types/platform';
import { isPlatformCode } from './typeGuards';
import { platformMapping } from '@/variables/mappings';

const getFullPlatform = (platform: Platform) => platformMapping[platform].label;

export function getPlatform(code: string) {
  if (!isPlatformCode(code)) return;
  return getFullPlatform(code);
}
