<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { computed, reactive, ref, watch } from 'vue';
import { getPercentage } from '@/helpers/maths';
import type { QTable, QTableColumn } from 'quasar';
import type { PaginationObject } from '@/types/pagination';
import { rowsPerPage } from '@/variables/pagination';
import type { BaseDiscovererData, DiscovererDataObject } from '@/types/data';
import { formatPercentage } from '@/helpers/formatting';
import { getPlatform } from '@/helpers/platform';

const dataStore = useDataStore();
const { filteredData, dataLength, amountTagged } = storeToRefs(dataStore);

const discovererTable = ref<QTable | null>(null);

const pagination = ref<PaginationObject>({
  sortBy: 'discoveries',
  descending: true,
  page: 1,
  rowsPerPage: 10,
});

const discovererStats = computed(() => {
  const discovererData: DiscovererDataObject = {};

  // prettier-ignore
  for (let i = 0; i < filteredData.value.length; i++) { // NoSonar this is for better performance
    const data = filteredData.value[i];
    if (!data.Discoverer) continue;

    const discovererObject = (discovererData[data.Discoverer] ??= {
      platform: '',
      discoveries: 0,
      discPercent: 0,
      tagged: 0,
      taggedPercent: 0,
      taggedPercentSelf: 0,
    });
    discovererObject.discoveries++;
    if (data['Correctly Prefixed']) discovererObject.tagged++;
    discovererObject.platform = getPlatform(data.Platform);
    discovererObject.discPercent = getPercentage(discovererObject.discoveries, dataLength.value);
    discovererObject.taggedPercent = getPercentage(discovererObject.tagged, amountTagged.value);
    discovererObject.taggedPercentSelf = getPercentage(discovererObject.tagged, discovererObject.discoveries);
  }

  const discovererDataArray: BaseDiscovererData[] = Object.entries(discovererData).map(([discoverer, stats]) => ({
    discoverer,
    ...stats,
  }));

  return discovererDataArray;
});

const sortedRows = ref<BaseDiscovererData[]>([]);

const columns: QTableColumn<BaseDiscovererData>[] = reactive([
  {
    name: 'pos',
    label: 'Pos.',
    align: 'left',
    field: (row) => `${sortedRows.value.indexOf(row) + 1}.`,
  },
  {
    name: 'name',
    label: 'Name',
    align: 'left',
    field: 'discoverer',
    sortable: true,
  },
  {
    name: 'platform',
    label: 'Platform',
    align: 'left',
    field: 'platform',
    sortable: true,
  },
  {
    name: 'discoveries',
    label: 'Discoveries',
    align: 'left',
    field: 'discoveries',
    sortable: true,
  },
  {
    name: 'discPercent',
    label: 'Discoveries %',
    align: 'left',
    field: 'discPercent',
    format: formatPercentage,
    sortable: true,
  },
  {
    name: 'tagged',
    label: 'Tagged',
    align: 'left',
    field: 'tagged',
    sortable: true,
  },
  {
    name: 'taggedPercent',
    label: 'Tagged %\nof total',
    align: 'left',
    field: 'taggedPercent',
    format: formatPercentage,
    sortable: true,
  },
  {
    name: 'taggedPercentSelf',
    label: 'Tag Rate',
    align: 'left',
    field: 'taggedPercentSelf',
    format: formatPercentage,
    sortable: true,
  },
]);

watch(
  [() => pagination.value.sortBy, () => pagination.value.descending, () => discovererTable.value?.filteredSortedRows],
  ([newSortCol, newSortDir, newTable]) => {
    if (!newSortCol) return;
    if (newSortDir) {
      sortedRows.value = newTable ? [...newTable] : [];
    } else {
      sortedRows.value = newTable ? [...newTable.toReversed()] : [];
    }
  },
  { immediate: true }
);

const dataHasSystems = computed(() => filteredData.value.some((item) => item.Category === 'SolarSystem'));

const nonSystemCols = columns.slice(0, -3); // NoSonar this removes the last 3 items, which are related to tagging
</script>

<template>
  <QExpansionItem
    v-if="discovererStats.length"
    label="Discoverer Stats"
    default-opened
  >
    <QTable
      v-model:pagination="pagination"
      :columns="dataHasSystems ? columns : nonSystemCols"
      :rows="discovererStats"
      :rows-per-page-options="rowsPerPage"
      class="q-px-md"
      column-sort-order="da"
      ref="discovererTable"
      table-header-class="table-header"
      binary-state-sort
      flat
    />
  </QExpansionItem>
</template>
