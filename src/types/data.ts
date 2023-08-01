export interface DiscoveryData {
  Name: string;
  Glyphs: string;
  Discoverer: string;
  Platform: string;
  Timestamp: string;
  UnixTimestamp: number;
  'Correctly Tagged': boolean;
  galaxy: 'Euclid' | 'Calypso' | 'Eissentam';
}

export type Platform = 'ST' | 'PS' | 'XB' | 'GX' | 'NI';

export type Galaxy = 'GHub' | 'CalHub' | 'EisHub';
