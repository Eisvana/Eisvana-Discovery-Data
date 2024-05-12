import { orders } from '@/variables/mappings';

export type Platform = 'ST' | 'PS' | 'XB' | 'GX' | 'NI';

export type ValueOf<T> = T[keyof T];

export interface DiscoveryData {
  Name: string;
  Glyphs: string;
  Discoverer: string;
  Platform: Platform;
  Timestamp: number;
}

export interface SystemData extends DiscoveryData {
  'Correctly Prefixed': boolean;
}

export interface Sorting {
  col: number;
  order: ValueOf<typeof orders>;
}

export interface TableHeadings {
  normal?: string[];
  sortable?: string[];
}

export interface DiscovererData {
  [key: string]: {
    discoveries: number;
    tags: number;
  };
}

export interface DiscovererDataArray {
  name: string;
  discoveries: number;
  tags: number;
}
