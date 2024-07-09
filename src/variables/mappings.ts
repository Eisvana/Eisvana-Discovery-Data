import gogIcon from '@/assets/images/platformGOG.png';
import psIcon from '@/assets/images/platformPS.png';
import steamIcon from '@/assets/images/platformSteam.png';
import switchIcon from '@/assets/images/platformSwitch.png';
import xbIcon from '@/assets/images/platformXB.png';

export const platformMapping = {
  ST: { label: 'Steam', colour: '#003EFF', icon: steamIcon },
  PS: { label: 'PlayStation', colour: '#0080FF', icon: psIcon },
  XB: { label: 'Xbox', colour: '#56FF56', icon: xbIcon },
  GX: { label: 'GOG', colour: '#EBFF3A', icon: gogIcon },
  NI: { label: 'Nintendo Switch', colour: '#FF3A3A', icon: switchIcon },
} as const;

export const chartColours = {
  blue: '#1095C1',
  red: '#e85123',
  green: '#1A8F1A',
  grey: '#888',
} as const;

export const categoryMapping = {
  SolarSystem: { label: 'System', colour: '#4287f5' },
  Planet: { label: 'Planet', colour: '#b8d16d' },
  Animal: { label: 'Creature', colour: '#fcba03' },
  Flora: { label: 'Flora', colour: '#32a852' },
  Mineral: { label: 'Mineral', colour: '#759487' },
  Base: { label: 'Base', colour: '#eb4034' },
  Settlement: { label: 'Settlement', colour: '#8d5eeb' },
} as const;
