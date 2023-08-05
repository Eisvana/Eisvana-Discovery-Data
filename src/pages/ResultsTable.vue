<script setup lang="ts">
import type { DiscoveryData } from '@/types/data';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import PaginationControls from '@/components/PaginationControls.vue';
import { useDataStore } from '@/stores/data';

const dataStore = useDataStore();
const { filteredData, currentPageIndex, itemsPerPage } = storeToRefs(dataStore);

interface TextArray {
  text: string;
  className: string;
}

function getFullPlatform(platform: string) {
  const platformMapping: {
    ST: string;
    PS: string;
    XB: string;
    GX: string;
    NI: string;
    [key: string]: string;
  } = {
    ST: 'Steam',
    PS: 'PlayStation',
    XB: 'Xbox',
    GX: 'GOG',
    NI: 'Nintendo Switch',
  };
  return platformMapping[platform];
}

const paginatedData = computed(() => {
  const pages: DiscoveryData[][] = filteredData.value.reduce((resultArray: DiscoveryData[][], item, index) => {
    const chunkIndex = Math.floor(index / itemsPerPage.value);

    resultArray[chunkIndex] ??= []; // start a new chunk

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);
  if (pages.length < currentPageIndex.value) currentPageIndex.value = 0;
  return pages;
});

const dataArray = computed(() => {
  const textArray: TextArray[] = [];
  for (const data of paginatedData.value[currentPageIndex.value] ?? []) {
    for (const [key, value] of Object.entries(data)) {
      const ignoredKeys = ['Timestamp', 'galaxy'];
      if (ignoredKeys.includes(key)) continue;

      let text: string = '';
      let className: string = '';

      switch (key) {
        case 'Name':
          text = (value as string) || 'Unknown (procedural name)';
          if (!value) className = 'italic';
          break;

        case 'Platform':
          text = getFullPlatform(value as string);
          break;

        case 'UnixTimestamp':
          text = new Date(value as number).toLocaleDateString();
          break;

        case 'Correctly Tagged':
          text = (value as boolean).toString().charAt(0).toUpperCase() + (value as boolean).toString().slice(1);
          break;

        default:
          text = value.toString();
          if (key === 'Glyphs') className = 'glyphs';
          break;
      }

      const newObj = {
        text,
        className,
      };

      textArray.push(newObj);
    }
  }
  return textArray;
});
</script>

<template>
  <div v-if="dataArray.length">
    <PaginationControls :total-items="paginatedData.length" />
    <div class="data-table">
      <div class="header">System Name</div>
      <div class="header">Glyphs</div>
      <div class="header">Discoverer</div>
      <div class="header">Platform</div>
      <div class="header">Date</div>
      <div class="header">Tagged</div>
      <div
        v-for="text in dataArray"
        :class="text.className"
      >
        {{ text.text }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.data-table {
  display: grid;
  grid-template-columns: repeat(6, auto);
  column-gap: 0.5rem;
  align-items: center;

  .header {
    font-weight: bold;
    border-block-end: 1px solid var(--color);
    padding-block-end: 0.25rem;
    padding-block-start: 0.5rem;
    position: sticky;
    top: 0;
    background-color: var(--background-color);
  }

  .italic {
    font-style: italic;
  }
}
</style>
