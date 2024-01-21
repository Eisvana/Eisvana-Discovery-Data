<script setup lang="ts">
import PaginationControls from '@/components/table/PaginationControls.vue';
import TableHeaders from '@/components/table/TableHeaders.vue';
import { paginateData } from '@/logic/logic';
import { appSections, platformMapping } from '@/objects/mappings';
import { useDataStore } from '@/stores/data';
import type { DiscoveryData, Platform, TableHeadings } from '@/types/data';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const dataStore = useDataStore();
const { filteredData, currentPageIndex, itemsPerPage } = storeToRefs(dataStore);

interface TextArray {
  text: string;
  className: string;
}

const getFullPlatform = (platform: Platform) => platformMapping[platform];

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

        case 'Correctly Prefixed':
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

const headers: TableHeadings = {
  normal: ['System Name', 'Glyphs', 'Discoverer', 'Platform', 'Date', 'Tagged'],
};
</script>

<template>
  <div v-if="dataArray.length">
    <PaginationControls
      :total-pages="paginatedData.length"
      :section="appSections.resultsTable"
    />
    <div class="data-table">
      <TableHeaders :headers="headers" />
      <div
        v-for="obj in dataArray"
        :class="obj.className"
      >
        {{ obj.text }}
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
