import type { DiscoveryCategories } from '@/types/data';

export const platformMapping = {
  ST: 'Steam',
  PS: 'PlayStation',
  XB: 'Xbox',
  GX: 'GOG',
  NI: 'Nintendo Switch',
} as const;

export const chartColours = {
  blue: '#1095C1',
  red: '#e85123',
  green: '#1A8F1A',
  grey: '#888',
} as const;

export const platformColours = {
  steam: '#003EFF',
  ps: '#0080FF',
  xb: '#56FF56',
  gog: '#EBFF3A',
  switch: '#FF3A3A',
} as const;

export const categoryMapping: Record<DiscoveryCategories, string> = {
  SolarSystem: 'System',
  Animal: 'Creature',
  Mineral: 'Mineral',
  Flora: 'Flora',
  Planet: 'Planet',
  Settlement: 'Settlement',
  Base: 'Base',
};

export const categoryColourMapping: Record<DiscoveryCategories, string> = {
  SolarSystem: '#4287f5',
  Animal: '#fcba03',
  Mineral: '#759487',
  Flora: '#32a852',
  Planet: '#b8d16d',
  Settlement: '#8d5eeb',
  Base: '#eb4034',
};
