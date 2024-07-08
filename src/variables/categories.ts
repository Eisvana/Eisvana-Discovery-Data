import type { DiscoveryCategories } from '@/types/data';
import { categoryMapping } from './mappings';

// using `as` here because Object.keys always returns string[].
// since the type DiscoveryCategories is generated from the categoryMapping object, this should never become a problem.
// please increment this counter if it has become a problem: 0
export const availableCategories = Object.keys(categoryMapping) as DiscoveryCategories[];
