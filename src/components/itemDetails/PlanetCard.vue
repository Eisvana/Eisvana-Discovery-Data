<script setup lang="ts">
import { getFormattedUTCDateString } from '@/helpers/date';
import type { DiscoveryData } from '@/types/data';
import baseIcon from '@/assets/images/base.png';
import creatureIcon from '@/assets/images/creature.png';
import floraIcon from '@/assets/images/flora.png';
import mineralIcon from '@/assets/images/mineral.png';
import settlementIcon from '@/assets/images/settlement.png';
import { reactive } from 'vue';
import DiscovererTag from './DiscovererTag.vue';
import GameIcon from '../GameIcon.vue';

const props = defineProps<{
  planetData: DiscoveryData;
}>();

const statData: {
  src: string;
  alt: string;
  title: string;
  counter: number;
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
  <QCard>
    <QCardSection :class="planetData.Name ? 'text-bold' : 'text-italic'">
      {{ planetData.Name || 'Unknown' }}
    </QCardSection>

    <QSeparator />

    <QCardSection>
      <div class="discoverer-data">
        <DiscovererTag
          :name="planetData.Discoverer"
          :platform="planetData.Platform"
        />
        <div>{{ getFormattedUTCDateString(planetData.Timestamp) }}</div>
      </div>
      <div class="glyphs">{{ planetData.Glyphs }}</div>
      <div class="stat-wrapper">
        <div
          v-for="stat in statData"
          :key="stat.title"
          :data-tooltip="stat.title"
        >
          <GameIcon
            :alt="stat.alt"
            :src="stat.src"
            :title="stat.title"
          />
          <span>{{ stat.counter }}</span>
        </div>
      </div>
    </QCardSection>

    <QSeparator />

    <QItem
      :to="`/planet/${planetData.Glyphs}`"
      class="planet-link"
      >View More</QItem
    >
  </QCard>
</template>

<style scoped lang="scss">
.discoverer-data {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

img {
  width: 2rem;
}

.stat-wrapper {
  display: flex;
  justify-content: space-between;

  & > * {
    display: flex;
    flex-direction: column;
    text-align: center;
    cursor: auto;
    border: none;
  }
}

.planet-link {
  display: flex;
  align-items: center;
}
</style>
