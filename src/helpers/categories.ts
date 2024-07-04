import type { DiscoveryCategories } from '@/types/data';
import { availableCategories } from '@/variables/categories';

export const isValidCategory = (cat: unknown): cat is DiscoveryCategories =>
  availableCategories.findIndex((item) => item === cat) !== -1;
