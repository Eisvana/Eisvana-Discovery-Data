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
