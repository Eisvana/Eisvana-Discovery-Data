<script setup lang="ts">
import { getPercentage, paginateData, sortData } from '@/logic/logic';
import { Orders, PlatformMapping } from '@/objects/mappings';
import { useDataStore } from '@/stores/data';
import type { TableHeadings } from '@/types/data';
import { storeToRefs } from 'pinia';
import { computed, reactive } from 'vue';
import DataTable from '../table/DataTable.vue';
import PaginationControls from '../table/PaginationControls.vue';

const dataStore = useDataStore();
const { filteredData, dataLength, amountTagged, itemsPerPage, currentPageIndex } = storeToRefs(dataStore);

interface DiscovererData {
  [key: string]: {
    platform: string;
    discoveries: number;
    discPercent: string;
    tagged: number;
    taggedPercent: string;
    taggedPercentSelf: string;
  };
}

const sorting = reactive<{ col: number; order: Orders }>({
  col: 2,
  order: Orders.desc,
});

const discovererStats = computed(() => {
  const discovererData: DiscovererData = {};

  for (const data of filteredData.value) {
    if (!data.Discoverer) continue;
    const discovererObject = (discovererData[data.Discoverer] ??= {
      platform: '',
      discoveries: 0,
      discPercent: '0%',
      tagged: 0,
      taggedPercent: '0%',
      taggedPercentSelf: '0%',
    });
    discovererObject.discoveries++;
    if (data['Correctly Tagged']) discovererObject.tagged++;
    discovererObject.platform = PlatformMapping[data.Platform];
    discovererObject.discPercent = getPercentage(discovererObject.discoveries, dataLength.value) + '%';
    discovererObject.taggedPercent = getPercentage(discovererObject.tagged, amountTagged.value) + '%';
    discovererObject.taggedPercentSelf = getPercentage(discovererObject.tagged, discovererObject.discoveries) + '%';
  }

  const dataArray: (string | number)[][] = [];

  for (const [discoverer, stats] of Object.entries(discovererData)) {
    dataArray.push([discoverer, ...Object.values(stats)]);
  }

  return dataArray;
});

const discovererDataSorted = computed(() => sortData(discovererStats.value, sorting));

const paginatedData = computed(() => {
  const pages = paginateData(discovererDataSorted.value, itemsPerPage.value.discovererStats) as (string | number)[][][];

  if (pages.length < currentPageIndex.value.discovererStats) currentPageIndex.value.discovererStats = 0;
  return pages;
});

const useableData = computed(() => paginatedData.value[currentPageIndex.value.discovererStats]?.flat() ?? []);

const headers: TableHeadings = {
  normal: ['Pos.'],
  sortable: ['Name', 'Platform', 'Discoveries', 'Discoveries %', 'Tagged', 'Tagged %\nof total', 'Tag Rate'],
};
</script>

<template>
  <details
    v-if="useableData.length"
    open
  >
    <summary>Discoverer Stats</summary>
    <PaginationControls
      :total-pages="paginatedData.length"
      section="discovererStats"
    />
    <DataTable
      :headers="headers"
      :sorting="sorting"
      :data="useableData"
    />
  </details>
</template>
