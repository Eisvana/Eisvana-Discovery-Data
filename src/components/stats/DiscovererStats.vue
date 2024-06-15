<script setup lang="ts">
import { platformMapping } from '@/variables/mappings';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { computed, reactive, ref, watch } from 'vue';
import { getPercentage } from '@/helpers/maths';
import type { QTable, QTableColumn } from 'quasar';
import type { PaginationObject } from '@/types/pagination';
import { rowsPerPage } from '@/variables/pagination';

const dataStore = useDataStore();
const { filteredData, dataLength, amountTagged } = storeToRefs(dataStore);

interface BaseDiscovererObject {
  platform: string;
  discoveries: number;
  discPercent: number;
  tagged: number;
  taggedPercent: number;
  taggedPercentSelf: number;
}

interface DiscovererData {
  [key: string]: BaseDiscovererObject;
}

interface UseableDiscovererObject extends BaseDiscovererObject {
  discoverer: string;
}

const discovererTable = ref<QTable | null>(null);

const pagination = ref<PaginationObject>({
  sortBy: 'discoveries',
  descending: true,
  page: 1,
  rowsPerPage: 10,
});

const discovererStats = computed(() => {
  const discovererData: DiscovererData = {};

  for (const data of filteredData.value) {
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
    discovererObject.platform = platformMapping[data.Platform];
    discovererObject.discPercent = getPercentage(discovererObject.discoveries, dataLength.value);
    discovererObject.taggedPercent = getPercentage(discovererObject.tagged, amountTagged.value);
    discovererObject.taggedPercentSelf = getPercentage(discovererObject.tagged, discovererObject.discoveries);
  }

  const discovererDataArray: UseableDiscovererObject[] = Object.entries(discovererData).map(([discoverer, stats]) => ({
    discoverer,
    ...stats,
  }));

  return discovererDataArray;
});

const sortedRows = ref<UseableDiscovererObject[]>([]);

const columns: QTableColumn<UseableDiscovererObject>[] = reactive([
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
    format: (val) => `${val}%`,
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
    format: (val) => `${val}%`,
    sortable: true,
  },
  {
    name: 'taggedPercentSelf',
    label: 'Tag Rate',
    align: 'left',
    field: 'taggedPercentSelf',
    format: (val) => `${val}%`,
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
</script>

<template>
  <QExpansionItem
    v-if="discovererStats.length"
    label="Discoverer Stats"
    default-opened
  >
    <QTable
      v-model:pagination="pagination"
      :columns
      :rows="discovererStats"
      :rows-per-page-options="rowsPerPage"
      ref="discovererTable"
      flat
    />
  </QExpansionItem>
</template>
