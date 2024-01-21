<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { useFilterStore } from '@/stores/filter';
import type { DiscoveryData } from '@/types/data';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import regions from '@/assets/regions.json';

const filterStore = useFilterStore();
const dataStore = useDataStore();

const { unixTimestamp, tagged, intersections, searchTerms, caseSensitivity, activeRegions, activePlatforms } =
  storeToRefs(filterStore);
const { filteredData } = storeToRefs(dataStore);

const isLoading = ref(false);

const resetStore = () => {
  filterStore.$reset();
  filteredData.value = [];
  const event = new Event('reset');
  document.dispatchEvent(event);
};

async function loadData() {
  isLoading.value = true;
  try {
    const { default: importedData } = await import(`../assets/eisvana.json`);

    const json: DiscoveryData[] = importedData as DiscoveryData[];

    filteredData.value = applyFilter(json);
  } catch (error) {
    console.warn(error);
  } finally {
    isLoading.value = false;
  }
}

function applyFilter(data: DiscoveryData[]) {
  const { startDate = 0, endDate = 0 } = unixTimestamp.value;

  const regionData = activeRegions.value.map((item) => searchRegion(item));

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
      (startDate < item.UnixTimestamp && item.UnixTimestamp < endDate + dayInMs) ||
      (startDate < item.UnixTimestamp && !endDate) ||
      (!startDate && item.UnixTimestamp < endDate + dayInMs);

    if (!isValidDate) return false;

    const isValidPlatform =
      (!activePlatforms.value.length && !item.Platform) || activePlatforms.value.includes(item.Platform);

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
  const regionGlyphs = Object.entries(regions).find((item) => item[1] === region)?.[0] ?? '';
  return { regionGlyphs };
}
</script>

<template>
  <div class="actions">
    <button
      :aria-busy="isLoading"
      role="button"
      type="submit"
      @click="loadData()"
    >
      Apply Filter
    </button>

    <input
      role="button"
      type="reset"
      value="Reset Filter"
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
    flex-basis: content;
    flex-grow: 1;
    max-width: 50%;
  }
}
</style>
@/objects/mappings
