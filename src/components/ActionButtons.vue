<script setup lang="ts">
import { GalaxyMapping, hubRegions } from '@/objects/galaxyMapping';
import { useFilterStore } from '@/stores/filter';
import type { DiscoveryData, Platform, Galaxy } from '@/types/data';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const filterStore = useFilterStore();

const { filteredData, unixTimestamp, platform, tagged, intersections, searchTerms, caseSensitivity, region } =
  storeToRefs(filterStore);

const isLoading = ref(false);

const resetStore = () => filterStore.$reset();

async function loadData() {
  const galaxies = filterStore.galaxy;
  const json: DiscoveryData[] = [];

  try {
    isLoading.value = true;
    await Promise.all(
      galaxies.map(async (galaxy) => {
        const { default: importedData } = await import(`../assets/${galaxy}/${galaxy}.json`);
        importedData.forEach((data: DiscoveryData) => {
          data.galaxy = GalaxyMapping[galaxy];
        });
        json.push(...importedData);
      })
    );
    console.time('filter');
    filteredData.value = await applyFilter(json);
    console.timeEnd('filter');
  } catch (error) {
    console.warn(error);
  } finally {
    isLoading.value = false;
  }
}

async function applyFilter(data: DiscoveryData[]) {
  const { startDate = 0, endDate = 0 } = unixTimestamp.value;

  const regions: {
    regionGlyphs: string;
    galaxy: string;
  }[] = [];
  for (const regionName of region.value) {
    const regionObj = await searchRegion(regionName);
    regions.push(regionObj);
  }

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

    const isValidPlatform = !platform.value.length || platform.value.includes(item.Platform as Platform);

    if (!isValidPlatform) return false;

    const isValidTagged =
      tagged.value === '' || (tagged.value && item['Correctly Tagged']) || (!tagged.value && !item['Correctly Tagged']);

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
      !regions.length ||
      regions.some((region) => item.galaxy === region.galaxy && item.Glyphs.slice(4) === region.regionGlyphs); // NoSonar region glyphs start at index 4

    return isValidRegion;
  }

  return data.filter(filterFunc);
}

async function searchRegion(region: string) {
  const { default: importedRegions } = await import('../assets/regions.json');
  const regionObjects = Object.values(importedRegions);
  const hubIndex = regionObjects.findIndex((item) => Object.values(item).includes(region));
  const regionIndex = Object.values(regionObjects[hubIndex]).indexOf(region);
  const hub = Object.keys(importedRegions)[hubIndex] as Galaxy;
  const regionGlyphs = Object.keys(regionObjects[hubIndex])[regionIndex];
  const galaxy = GalaxyMapping[hub];
  return {
    regionGlyphs,
    galaxy,
  };
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
