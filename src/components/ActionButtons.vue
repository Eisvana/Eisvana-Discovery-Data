<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { useFilterStore } from '@/stores/filter';
import type { DiscoveryData } from '@/types/data';
import { storeToRefs } from 'pinia';
import { ref, watchEffect } from 'vue';
import { regions as allEisvanaRegions } from '@/variables/regions';
import { watchDebounced } from '@vueuse/core';
import { isDiscoveryData } from '@/helpers/typeGuards';

const filterStore = useFilterStore();
const dataStore = useDataStore();

const { unixTimestamp, tagged, intersections, searchTerms, caseSensitivity, regions, platforms, categories } =
  storeToRefs(filterStore);
const { filteredData, isLoading } = storeToRefs(dataStore);

const temporaryData = ref<DiscoveryData[][]>([]);

watchEffect(() => (filteredData.value = temporaryData.value.flat()));

watchDebounced(
  [unixTimestamp, tagged, intersections, searchTerms, caseSensitivity, regions, platforms, categories],
  loadData,
  { deep: true, immediate: true, debounce: 500 }
);

const resetStore = () => {
  filterStore.$reset();
  filteredData.value = [];
  const event = new Event('reset');
  document.dispatchEvent(event);
};

async function loadData() {
  isLoading.value = true;

  try {
    const animalImports = import.meta.glob('../assets/animals/*.json', { import: 'default' });
    const baseImports = import.meta.glob('../assets/bases/*.json', { import: 'default' });
    const floraImports = import.meta.glob('../assets/flora/*.json', { import: 'default' });
    const mineralImports = import.meta.glob('../assets/minerals/*.json', { import: 'default' });
    const planetImports = import.meta.glob('../assets/planets/*.json', { import: 'default' });
    const settlementImports = import.meta.glob('../assets/settlements/*.json', { import: 'default' });
    const systemImports = import.meta.glob('../assets/systems/*.json', { import: 'default' });

    const importMapping: Record<string, Record<string, () => Promise<unknown>>> = {
      creature: animalImports,
      base: baseImports,
      flora: floraImports,
      mineral: mineralImports,
      planet: planetImports,
      settlement: settlementImports,
      system: systemImports,
    };

    const regionMapping: string[] = Object.values(allEisvanaRegions);

    const activeRegionCodes = regions.value
      .map((item) => regionMapping.indexOf(item) + 1)
      .filter(Boolean)
      .map((item) => `EV${item}`);

    const imports = categories.value.flatMap((category) => {
      const entries = Object.entries(importMapping[category]); // [[path/to/file.json, () => import(file.json)], [path/to/anotherfile.json, () => import(anotherfile.json)]]
      return entries
        .filter((item) => activeRegionCodes.some((regionCode) => item[0].endsWith(`${regionCode}.json`)))
        .map((item) => item[1]);
    });

    const amountOfRequests = imports.length;
    temporaryData.value = Array.from({ length: amountOfRequests }, () => []);
    const importData = imports.map(addData);
    await Promise.all(importData);
  } catch (error) {
    console.warn(error);
  } finally {
    isLoading.value = false;
  }
}

async function addData(getData: () => Promise<unknown>, index: number) {
  const data = await getData();
  if (!Array.isArray(data)) return;
  const trueDiscoveryData = data.filter((item) => isDiscoveryData(item));
  temporaryData.value[index] = applyFilter(trueDiscoveryData);
}

function applyFilter(data: DiscoveryData[]) {
  const { startDate = 0, endDate = 0 } = unixTimestamp.value;

  const regionData = regions.value.map((item) => searchRegion(item));

  // handle case sensitivity option
  const searchName = caseSensitivity.value.name ? searchTerms.value.name : searchTerms.value.name.toLowerCase();
  const searchDiscoverer = caseSensitivity.value.discoverer
    ? searchTerms.value.discoverer
    : searchTerms.value.discoverer.toLowerCase();

  // shorten variable names
  const intersectionName = intersections.value.name;
  const intersectionGlyphs = intersections.value.glyphs;
  const intersectionDiscoverer = intersections.value.discoverer;
  const searchGlyphs = searchTerms.value.glyphs.slice(1).toUpperCase();

  function filterFunc(item: DiscoveryData) {
    // handle case sensitivity option
    const itemName = caseSensitivity.value.name ? item.Name : item.Name.toLowerCase();
    const itemDiscoverer = caseSensitivity.value.discoverer ? item.Discoverer : item.Discoverer.toLowerCase();

    // shorten variable names
    const itemGlyphs = item.Glyphs.slice(1);

    // begin filtering
    const dayInMs = 86400000;
    const isValidDate =
      (!startDate && !endDate) ||
      (startDate < item.Timestamp && item.Timestamp < endDate + dayInMs) ||
      (startDate < item.Timestamp && !endDate) ||
      (!startDate && item.Timestamp < endDate + dayInMs);

    if (!isValidDate) return false;

    const isValidPlatform = (!platforms.value.length && !item.Platform) || platforms.value.includes(item.Platform);

    if (!isValidPlatform) return false;

    const isValidTagged =
      tagged.value === '' ||
      (tagged.value && item['Correctly Prefixed']) ||
      (!tagged.value && !item['Correctly Prefixed']);

    if (!isValidTagged) return false;

    const isValidName =
      !searchName ||
      (intersectionName === 'includes' && itemName.includes(searchName)) ||
      (intersectionName === 'is' && itemName === searchName) ||
      (intersectionName === '!includes' && !itemName.includes(searchName)) ||
      (intersectionName === '!is' && itemName !== searchName);

    if (!isValidName) return false;

    const isValidGlyphs =
      !searchGlyphs ||
      (intersectionGlyphs === 'includes' && itemGlyphs.includes(searchGlyphs)) ||
      (intersectionGlyphs === 'is' && itemGlyphs === searchGlyphs) ||
      (intersectionGlyphs === '!includes' && !itemGlyphs.includes(searchGlyphs)) ||
      (intersectionGlyphs === '!is' && itemGlyphs !== searchGlyphs);

    if (!isValidGlyphs) return false;

    const isValidDiscoverer =
      !searchDiscoverer ||
      (intersectionDiscoverer === 'includes' && itemDiscoverer.includes(searchDiscoverer)) ||
      (intersectionDiscoverer === 'is' && itemDiscoverer === searchDiscoverer) ||
      (intersectionDiscoverer === '!includes' && !itemDiscoverer.includes(searchDiscoverer)) ||
      (intersectionDiscoverer === '!is' && itemDiscoverer !== searchDiscoverer);

    if (!isValidDiscoverer) return false;

    const isValidRegion =
      (!regionData.length && !item.Glyphs) || regionData.some((region) => item.Glyphs.slice(4) === region.regionGlyphs); // NoSonar region glyphs start at index 4

    return isValidRegion;
  }

  return data.filter(filterFunc);
}

function searchRegion(region: string) {
  const regionGlyphs = Object.entries(allEisvanaRegions).find((item) => item[1] === region)?.[0] ?? '';
  return { regionGlyphs };
}
</script>

<template>
  <div class="actions">
    <QBtn
      label="Reset Filter"
      type="reset"
      @click="resetStore"
    />
  </div>
</template>

<style scoped lang="scss">
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  & > * {
    flex: 1;
  }
}
</style>
