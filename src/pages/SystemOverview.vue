<script setup lang="ts">
import PlanetCard from '@/components/itemDetails/PlanetCard.vue';
import type { DiscoveryData } from '@/types/data';
import { onMounted, reactive, ref } from 'vue';
import { regions } from '@/variables/regions';
import { useRoute } from 'vue-router';
import OverviewHeader from '@/components/itemDetails/OverviewHeader.vue';
import DiscoveryNote from '@/components/itemDetails/DiscoveryNote.vue';
import UndiscoveredNote from '@/components/itemDetails/UndiscoveredNote.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';

const planetData: DiscoveryData[] = reactive([]);
const systemData = ref<DiscoveryData>();
const isLoading = ref(true);

const route = useRoute();

onMounted(async () => {
  const glyphs = route.params.glyphs;
  if (typeof glyphs !== 'string') return;
  const planetsPerSystem = 6;
  const regionGlyphs = Object.keys(regions);
  const regionIndex = regionGlyphs.findIndex((item) => glyphs.endsWith(item));
  const regionNumber = regionIndex + 1;
  const glyphsWithoutPlanetIndex = glyphs.slice(1);
  const data: { default: DiscoveryData[] } = await import(`../assets/Planet/EV${regionNumber}.json`);
  for (let i = 1; i <= planetsPerSystem; i++) {
    const planetGlyphs = `${i}${glyphsWithoutPlanetIndex}`;
    const planetObject = data.default.find((item) => item.Glyphs === planetGlyphs);
    if (planetObject) planetData.push(planetObject);
  }

  const systemDataFile: { default: DiscoveryData[] } = await import(`../assets/SolarSystem/EV${regionNumber}.json`);
  const systemDataObject = systemDataFile.default.find((item) => item.Glyphs.endsWith(glyphsWithoutPlanetIndex)); // ignoring the planet index
  systemData.value = systemDataObject;
  isLoading.value = false;
});
</script>

<template>
  <template v-if="!isLoading">
    <OverviewHeader
      v-if="systemData"
      :item-data="systemData"
    />

    <UndiscoveredNote
      v-else
      type="system"
    />

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
        class="q-mx-auto"
      >
        No planets discovered!
      </p>
    </div>
  </template>

  <LoadingOverlay v-if="isLoading" />
</template>

<style scoped lang="scss">
.planet-cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>
