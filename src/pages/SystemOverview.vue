<script setup lang="ts">
import PlanetCard from '@/components/itemDetails/PlanetCard.vue';
import type { DiscoveryData } from '@/types/data';
import { onMounted, reactive } from 'vue';
import { regions } from '@/variables/regions';
import { useRoute } from 'vue-router';
import DiscoveryNote from '@/components/DiscoveryNote.vue';

const planetData: DiscoveryData[] = reactive([]);

const route = useRoute();

onMounted(async () => {
  const glyphs = route.params.glyphs;
  if (typeof glyphs !== 'string') return;
  const planetsPerSystem = 6;
  const regionGlyphs = Object.keys(regions);
  const regionIndex = regionGlyphs.findIndex((item) => glyphs.endsWith(item));
  const regionNumber = regionIndex + 1;
  const data: { default: DiscoveryData[] } = await import(`../assets/planets/EV${regionNumber}.json`);
  for (let i = 1; i <= planetsPerSystem; i++) {
    const planetGlyphs = `${i}${glyphs.slice(1)}`;
    const planetObject = data.default.find((item) => item.Glyphs === planetGlyphs);
    if (planetObject) planetData.push(planetObject);
  }
});
</script>

<template>
  <DiscoveryNote />
  <div class="planet-cards-container">
    <PlanetCard
      v-if="planetData.length"
      v-for="planet in planetData"
      :key="planet.Glyphs"
      :planet-data="planet"
    />
    <p
      v-else
      class="undiscovered"
    >
      No planets discovered!
    </p>
  </div>
</template>

<style scoped lang="scss">
.planet-cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.undiscovered {
  margin-inline: auto;
}
</style>
