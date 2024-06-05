import { platformMapping } from './mappings';
import gogIcon from '@/assets/images/platformGOG.png';
import psIcon from '@/assets/images/platformPS.png';
import steamIcon from '@/assets/images/platformSteam.png';
import switchIcon from '@/assets/images/platformSwitch.png';
import xbIcon from '@/assets/images/platformXB.png';
import type { Platform } from '@/types/platform';

export const platformCodes = Object.keys(platformMapping);

export const platformIcons: Record<Platform, string> = {
  ST: steamIcon,
  PS: psIcon,
  XB: xbIcon,
  GX: gogIcon,
  NI: switchIcon,
};
