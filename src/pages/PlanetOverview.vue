<script setup lang="ts">
import type { DiscoveryData, PlanetDetails } from '@/types/data';
import { regions } from '@/variables/regions';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import PlanetDetailsTable from '@/components/itemDetails/PlanetDetailsTable.vue';
import DiscoveryNote from '@/components/itemDetails/DiscoveryNote.vue';
import UndiscoveredNote from '@/components/itemDetails/UndiscoveredNote.vue';
import OverviewHeader from '@/components/itemDetails/OverviewHeader.vue';
import { availableCategories } from '@/variables/categories';

const route = useRoute();

const planetDetails: PlanetDetails = reactive({});
const planetData = ref<DiscoveryData>();

function getRegionFromGlyphs(glyphs: string) {
  const regionCoords = glyphs.slice(4);
  const regionNumber = Object.keys(regions).indexOf(regionCoords);
  return regionNumber;
}

onMounted(async () => {
  const glyphs = route.params.glyphs;
  if (Array.isArray(glyphs)) return;
  const regionIndex = getRegionFromGlyphs(glyphs);
  const regionNumber = regionIndex + 1;

  // forEach doesn't support `await`, so the import statements are fired almost at the same time instead of waiting for the previous one
  availableCategories.forEach(async (cat) => {
    const data: { default: DiscoveryData[] } = await import(`../assets/${cat}/EV${regionNumber}.json`);
    const itemsOnPlanet = data.default.filter((item) => item.Glyphs === glyphs);
    planetDetails[cat] = itemsOnPlanet;
  });

  const data: { default: DiscoveryData[] } = await import(`../assets/Planet/EV${regionNumber}.json`);
  const planetObject = data.default.find((item) => item.Glyphs === glyphs);
  planetData.value = planetObject;
});
</script>

<template>
  <OverviewHeader
    v-if="planetData"
    :item-data="planetData"
  />

  <UndiscoveredNote
    v-else
    type="planet"
  />

  <DiscoveryNote />

  <div class="column q-gutter-y-sm">
    <PlanetDetailsTable
      :planetDetails="planetDetails.Animal"
      itemType="Creatures"
    />
    <PlanetDetailsTable
      :planetDetails="planetDetails.Flora"
      itemType="Flora"
    />
    <PlanetDetailsTable
      :planetDetails="planetDetails.Mineral"
      itemType="Minerals"
    />
    <PlanetDetailsTable
      :headings="['Name', 'Builder', 'Platform', 'Mode', 'Parts', 'Timestamp']"
      :planetDetails="planetDetails.Base"
      itemType="Bases"
    />
    <PlanetDetailsTable
      :headings="['Name', 'Overseer', 'Platform', 'Timestamp']"
      :planetDetails="planetDetails.Settlement"
      itemType="Settlements"
    />
  </div>
</template>
