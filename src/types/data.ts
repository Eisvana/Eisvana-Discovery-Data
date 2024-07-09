import type { categoryMapping, platformMapping } from '@/variables/mappings';
import type { Platform } from './platform';

export type DiscoveryCategories = keyof typeof categoryMapping;

export type PlatformLabels = (typeof platformMapping)[keyof typeof platformMapping]['label'];

export interface DiscoveryData {
  Category: DiscoveryCategories;
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

export interface DiscovererDataArray extends Partial<Record<DiscoveryCategories, number>> {
  name: string;
  discoveries: number;
  tags: number;
  mistags: number;
}

export interface DiscovererData {
  [name: string]: Omit<DiscovererDataArray, 'name'>;
}

export interface PlatformDataArray extends Partial<Record<DiscoveryCategories, number>> {
  platform: Platform;
  discoveries: number;
  tags: number;
  mistags: number;
}

export type PlanetDetails = Partial<Record<DiscoveryCategories, DiscoveryData[]>>;

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
