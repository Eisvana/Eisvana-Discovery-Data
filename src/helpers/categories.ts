import type { DiscoveryCategories } from '@/types/data';
import { availableCategories } from '@/variables/categories';

export const isValidCategory = (cat: unknown): cat is DiscoveryCategories =>
  availableCategories.find((item) => item === cat) !== undefined;
