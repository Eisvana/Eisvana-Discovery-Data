import type { Platform } from './platform';

export interface DiscoveryData {
  Name: string;
  Glyphs: string;
  Discoverer: string;
  Platform: Platform;
  Timestamp: number;
  'Correctly Prefixed'?: boolean;
  Planets?: number;
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
    mistags: number;
  };
}

export interface DiscovererDataArray {
  name: string;
  discoveries: number;
  tags: number;
  mistags: number;
}

export type PlanetDetailItems = 'bases' | 'settlements' | 'animals' | 'flora' | 'minerals';
export type PlanetDetails = Partial<Record<PlanetDetailItems, DiscoveryData[]>>;

export interface BaseDiscovererData {
  platform?: string;
  players?: number;
  discoverer?: string;
  discoveries: number;
  discPercent: number;
  tagged: number;
  taggedPercent: number;
  taggedPercentSelf: number;
}

export interface DiscovererDataObject {
  [key: string]: BaseDiscovererData;
}

export interface NumberStats {
  systemsNotTagged: number;
  systemsProcName: number;
  nonSystemsProcName: number;
  systemsUndiscovered: number;
  discovererNumber: number;
  dataHasSystems: boolean;
  avgDiscoverersPerDay: string; // because .toFixed() converts to string
  systemsDuplicates: [string, number][];
}
