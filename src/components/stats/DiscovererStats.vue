<script setup lang="ts">
import { appSections, orders, platformMapping } from '@/variables/mappings';
import { useDataStore } from '@/stores/data';
import type { TableHeadings } from '@/types/data';
import { storeToRefs } from 'pinia';
import { computed, reactive, watchEffect } from 'vue';
import DataTable from '../table/DataTable.vue';
import PaginationControls from '../table/PaginationControls.vue';
import { getPercentage } from '@/helpers/maths';
import { paginateData } from '@/helpers/paginate';
import { sortData } from '@/helpers/sorting';
import type { ValueOf } from '@/types/utility';

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

const sorting = reactive<{ col: number; order: ValueOf<typeof orders> }>({
  col: 2,
  order: orders.desc,
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
    if (data['Correctly Prefixed']) discovererObject.tagged++;
    discovererObject.platform = platformMapping[data.Platform];
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

const paginatedData = computed(() => paginateData(discovererDataSorted.value, itemsPerPage.value.discovererStats));
const useableData = computed(() => paginatedData.value[currentPageIndex.value.discovererStats]?.flat() ?? []);

watchEffect(() => {
  if (paginatedData.value.length < currentPageIndex.value.discovererStats) currentPageIndex.value.discovererStats = 0;
});

const headers: TableHeadings = {
  normal: ['Pos.'],
  sortable: ['Name', 'Platform', 'Discoveries', 'Discoveries %', 'Tagged', 'Tagged %\nof total', 'Tag Rate'],
};
</script>

<template>
  <QExpansionItem
    v-if="useableData.length"
    label="Discoverer Stats"
    default-opened
  >
    <PaginationControls
      :total-pages="paginatedData.length"
      :section="appSections.discovererStats"
    />
    <DataTable
      :headers="headers"
      :sorting="sorting"
      :data="useableData"
    />
  </QExpansionItem>
</template>
