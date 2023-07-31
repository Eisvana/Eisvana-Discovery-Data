<script setup lang="ts">
import { useFilterStore } from '@/stores/filter';
import type { DiscoveryData, Platform } from '@/types/data';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const filterStore = useFilterStore();

const { data, filteredData, unixTimestamp, platform, tagged, intersections, searchTerms } = storeToRefs(filterStore);

const isLoading = ref(false);

const resetStore = () => filterStore.$reset();

async function loadData() {
  const galaxies = filterStore.galaxy;

  const json: DiscoveryData[] = [];

  isLoading.value = true;
  for (const galaxy of galaxies) {
    try {
      const { default: importedData } = await import(`../assets/${galaxy}/${galaxy}.json`);
      json.push(...importedData);
      data.value = json;
      applyFilter();
    } catch (error) {
      data.value = [];
      console.warn(error);
    }
  }
  isLoading.value = false;
}

function applyFilter() {
  const { startDate = 0, endDate = 0 } = unixTimestamp.value;
  function filterFunc(item: DiscoveryData) {
    const dayInMs = 86400000;
    const isValidDate =
      (startDate < item.UnixTimestamp && item.UnixTimestamp < endDate + dayInMs) ||
      (startDate < item.UnixTimestamp && !endDate) ||
      (!startDate && item.UnixTimestamp < endDate + dayInMs) ||
      (!startDate && !endDate);

    const isValidPlatform = !platform.value.length || platform.value.includes(item.Platform as Platform);

    const isValidTagged =
      tagged.value === '' || (tagged.value && item['Correctly Tagged']) || (!tagged.value && !item['Correctly Tagged']);

    const isValidName =
      !searchTerms.value.name ||
      (intersections.value.name === 'includes' && item.Name.includes(searchTerms.value.name)) ||
      (intersections.value.name === 'is' && item.Name === searchTerms.value.name) ||
      (intersections.value.name === '!includes' && !item.Name.includes(searchTerms.value.name)) ||
      (intersections.value.name === '!is' && item.Name !== searchTerms.value.name);

    const isValidGlyphs =
      !searchTerms.value.glyphs ||
      (intersections.value.glyphs === 'includes' && item.Glyphs.slice(1).includes(searchTerms.value.glyphs.slice(1))) ||
      (intersections.value.glyphs === 'is' && item.Glyphs.slice(1) === searchTerms.value.glyphs.slice(1)) ||
      (intersections.value.glyphs === '!includes' &&
        !item.Glyphs.slice(1).includes(searchTerms.value.glyphs.slice(1))) ||
      (intersections.value.glyphs === '!is' && item.Glyphs.slice(1) !== searchTerms.value.glyphs.slice(1));

    const isValidDiscoverer =
      !searchTerms.value.discoverer ||
      (intersections.value.discoverer === 'includes' && item.Discoverer.includes(searchTerms.value.discoverer)) ||
      (intersections.value.discoverer === 'is' && item.Discoverer === searchTerms.value.discoverer) ||
      (intersections.value.discoverer === '!includes' && !item.Discoverer.includes(searchTerms.value.discoverer)) ||
      (intersections.value.discoverer === '!is' && item.Discoverer !== searchTerms.value.discoverer);

    return isValidDate && isValidName && isValidPlatform && isValidTagged && isValidGlyphs && isValidDiscoverer;
  }

  const resultArray = data.value.filter(filterFunc);

  filteredData.value = resultArray;
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
