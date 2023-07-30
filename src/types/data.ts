export interface DiscoveryData {
  Name: string;
  Glyphs: string;
  Discoverer: string;
  Platform: string;
  Timestamp: string;
  UnixTimestamp: number;
  "Correctly Tagged": boolean;
}

export type Platform = "ST" | "PS" | "XB" | "GX" | "NI";
