<script setup lang="ts">
import type { DiscoveryData, Platform } from '@/types/data';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import PaginationControls from '@/components/table/PaginationControls.vue';
import { useDataStore } from '@/stores/data';
import { paginateData } from '@/logic/logic';
import { PlatformMapping } from '@/objects/mappings';

const dataStore = useDataStore();
const { filteredData, currentPageIndex, itemsPerPage } = storeToRefs(dataStore);

interface TextArray {
  text: string;
  className: string;
}

const getFullPlatform = (platform: Platform) => PlatformMapping[platform];

const paginatedData = computed(() => {
  const pages = paginateData(filteredData.value, itemsPerPage.value.resultsTable) as DiscoveryData[][];

  if (pages.length < currentPageIndex.value.resultsTable) currentPageIndex.value.resultsTable = 0;
  return pages;
});

const dataArray = computed(() => {
  const textArray: TextArray[] = [];
  for (const data of paginatedData.value[currentPageIndex.value.resultsTable] ?? []) {
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
          text = getFullPlatform(value as Platform);
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
    <PaginationControls
      :total-pages="paginatedData.length"
      section="resultsTable"
    />
    <div class="data-table">
      <div class="table-header">System Name</div>
      <div class="table-header">Glyphs</div>
      <div class="table-header">Discoverer</div>
      <div class="table-header">Platform</div>
      <div class="table-header">Date</div>
      <div class="table-header">Tagged</div>
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

  .italic {
    font-style: italic;
  }
}
</style>
