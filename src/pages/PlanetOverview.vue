<script setup lang="ts">
import { getFormattedUTCDateString } from '@/helpers/date';
import { getPlatform } from '@/helpers/platform';
import type { DiscoveryData, PlanetDetailItems, PlanetDetails } from '@/types/data';
import { regions } from '@/variables/regions';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import PlanetDetailsTable from '@/components/itemDetails/PlanetDetailsTable.vue';
import DiscoveryNote from '@/components/DiscoveryNote.vue';
import OverviewHeader from '@/components/itemDetails/OverviewHeader.vue';

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
  const detailItems: PlanetDetailItems[] = ['bases', 'settlements', 'animals', 'flora', 'minerals'];

  // forEach doesn't support `await`, so the import statements are fired almost at the same time instead of waiting for the previous one
  detailItems.forEach(async (detail) => {
    const data: { default: DiscoveryData[] } = await import(`../assets/${detail}/EV${regionNumber}.json`);
    const itemsOnPlanet = data.default.filter((item) => item.Glyphs === glyphs);
    planetDetails[detail] = itemsOnPlanet;
  });

  const data: { default: DiscoveryData[] } = await import(`../assets/planets/EV${regionNumber}.json`);
  const planetObject = data.default.find((item) => item.Glyphs === glyphs);
  planetData.value = planetObject;
});
</script>

<template>
  <OverviewHeader
    v-if="planetData"
    :item-data="planetData"
  />
  <p v-else>Something went wrong!</p>

  <DiscoveryNote />

  <QExpansionItem
    :disable="!planetDetails.bases?.length"
    :label="`Bases (${planetDetails.bases?.length})`"
  >
    <table class="striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Builder</th>
          <th>Platform</th>
          <th>Mode</th>
          <th>Parts</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="base in planetDetails.bases">
          <td>{{ base.Name }}</td>
          <td>{{ base.Discoverer }}</td>
          <td>{{ getPlatform(base.Platform) }}</td>
          <td>{{ base.Gamemode }}</td>
          <td>{{ base.Parts }}</td>
          <td>{{ getFormattedUTCDateString(base.Timestamp) }}</td>
        </tr>
      </tbody>
    </table>
  </QExpansionItem>
  <PlanetDetailsTable
    :planetDetails="planetDetails.animals"
    itemType="Creatures"
  />
  <PlanetDetailsTable
    :planetDetails="planetDetails.flora"
    itemType="Flora"
  />
  <PlanetDetailsTable
    :planetDetails="planetDetails.minerals"
    itemType="Minerals"
  />
  <PlanetDetailsTable
    :headings="['Name', 'Overseer', 'Platform', 'Timestamp']"
    :planetDetails="planetDetails.settlements"
    itemType="Settlements"
  />
</template>
