import type { Orders } from "@/objects/mappings";

export type Platform = 'ST' | 'PS' | 'XB' | 'GX' | 'NI';

export interface DiscoveryData {
  Name: string;
  Glyphs: string;
  Discoverer: string;
  Platform: Platform;
  Timestamp: string;
  UnixTimestamp: number;
  'Correctly Tagged': boolean;
  galaxy: 'Euclid' | 'Calypso' | 'Eissentam';
}

export type Hub = 'GHub' | 'CalHub' | 'EisHub';

export interface Sorting {
  col: number;
  order: Orders
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
