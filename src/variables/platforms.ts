import type { Platform } from '@/types/platform';
import { platformMapping } from './mappings';

// using `as` here because Object.keys always returns string[].
// since the type Platform is generated from the platformMapping object, this should never become a problem.
// please increment this counter if it has become a problem: 0
export const platformCodes = Object.keys(platformMapping) as Platform[];
