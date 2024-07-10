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

export type PartialDiscoveryCategoryNumbers = Partial<Record<DiscoveryCategories, number>>;

interface BaseDiscoveryObject {
  discoveries: number;
  tags: number;
  mistags: number;
}

export type DiscovererDataArray = PartialDiscoveryCategoryNumbers &
  BaseDiscoveryObject & {
    name: string;
  };

export interface DiscovererData {
  [name: string]: Omit<DiscovererDataArray, 'name'>;
}

export type PlatformDataArray = PartialDiscoveryCategoryNumbers &
  BaseDiscoveryObject & {
    platform: Platform;
  };

export type TimestampDataArray = PartialDiscoveryCategoryNumbers &
  BaseDiscoveryObject & {
    ts: string;
  };

export interface TimestampData {
  [ts: string]: Omit<TimestampDataArray, 'ts'>;
}

type PartialPlatformDiscoveryNumbers = Partial<Record<Platform, number>>;

export type TimeTrackingCategories = 'individual' | 'accumulated';

export type TimestampPlatformData = {
  [ts: string]: Record<TimeTrackingCategories, PartialPlatformDiscoveryNumbers>;
};

export interface PlayerPaginationData {
  name: string;
  colour: string;
  discoveries: number;
}

export interface PlayerDiscoveryNumbers {
  [ts: string]: {
    [name: string]: Pick<PlayerPaginationData, 'colour'> & Record<TimeTrackingCategories, number>;
  };
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
  avgDiscoverersPerDay: string; // because .toFixed() converts to string
  systemsDuplicates: [string, number][];
}
