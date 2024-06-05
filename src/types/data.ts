import type { Platform } from './platform';

export interface DiscoveryData {
  Name: string;
  Glyphs: string;
  Discoverer: string;
  Platform: Platform;
  Timestamp: number;
  'Correctly Prefixed'?: boolean;
  Bases?: number;
  Settlements?: number;
  Flora?: number;
  Fauna?: number;
  Minerals?: number;
  Parts?: number;
  Gamemode?: string;
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

export type PlanetDetailItems = 'bases' | 'settlements' | 'animals' | 'flora' | 'minerals';
export type PlanetDetails = Partial<Record<PlanetDetailItems, DiscoveryData[]>>;
