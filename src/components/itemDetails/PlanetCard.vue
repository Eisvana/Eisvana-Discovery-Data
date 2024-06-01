<script setup lang="ts">
import { getFormattedUTCDateString } from '@/helpers/date';
import { getPlatform } from '@/helpers/platform';
import type { DiscoveryData } from '@/types/data';
import baseIcon from '@/assets/images/base.png';
import creatureIcon from '@/assets/images/creature.png';
import floraIcon from '@/assets/images/flora.png';
import mineralIcon from '@/assets/images/mineral.png';
import settlementIcon from '@/assets/images/settlement.png';
import gogIcon from '@/assets/images/platformGOG.png';
import psIcon from '@/assets/images/platformPS.png';
import steamIcon from '@/assets/images/platformSteam.png';
import switchIcon from '@/assets/images/platformSwitch.png';
import xbIcon from '@/assets/images/platformXB.png';
import type { Platform } from '@/types/platform';
import { reactive } from 'vue';

const props = defineProps<{
  planetData: DiscoveryData;
}>();

const platformIcons: Record<Platform, string> = {
  ST: steamIcon,
  PS: psIcon,
  XB: xbIcon,
  GX: gogIcon,
  NI: switchIcon,
};

const statData: {
  src: string;
  alt: string;
  title: string;
  counter: number | undefined;
}[] = reactive([
  {
    src: creatureIcon,
    alt: 'Creature Icon',
    title: 'Creatures',
    counter: props.planetData.Fauna ?? 0,
  },
  {
    src: floraIcon,
    alt: 'Flora Icon',
    title: 'Flora',
    counter: props.planetData.Flora ?? 0,
  },
  {
    src: mineralIcon,
    alt: 'Mineral Icon',
    title: 'Minerals',
    counter: props.planetData.Minerals ?? 0,
  },
  {
    src: settlementIcon,
    alt: 'Settlement Icon',
    title: 'Settlements',
    counter: props.planetData.Settlements ?? 0,
  },
  {
    src: baseIcon,
    alt: 'Base Icon',
    title: 'Bases',
    counter: props.planetData.Bases ?? 0,
  },
]);
</script>

<template>
  <article>
    <header :class="planetData.Name ? 'text-bold' : 'italic'">
      {{ planetData.Name || 'Unknown' }}
    </header>
    <div class="stat-grid">
      <div class="discoverer-data">
        <div class="discoverer-name-platform">
          <span>{{ planetData.Discoverer }}</span>
          <img
            :alt="`${getPlatform(planetData.Platform)} Icon`"
            :src="platformIcons[planetData.Platform]"
            class="platform-icon"
          />
        </div>
        <div>{{ getFormattedUTCDateString(planetData.Timestamp) }}</div>
      </div>
      <div class="glyphs">{{ planetData.Glyphs }}</div>
      <div>
        <div
          v-for="stat in statData"
          :key="stat.title"
        >
          <img
            :alt="stat.alt"
            :src="stat.src"
            :title="stat.title"
          />
          <span>{{ stat.counter }}</span>
        </div>
      </div>
    </div>
    <footer>
      <RouterLink :to="`/system/${planetData.Glyphs}`">View More</RouterLink>
    </footer>
  </article>
</template>

<style scoped lang="scss">
.stat-grid {
  .discoverer-data {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .discoverer-name-platform {
      display: flex;
      gap: 0.25rem;
    }
  }

  .platform-icon {
    width: 1.55rem;
  }

  img {
    width: 2rem;
    filter: invert(100);
  }
}

[data-theme='dark'] .stat-grid img {
  filter: unset;
}
</style>
