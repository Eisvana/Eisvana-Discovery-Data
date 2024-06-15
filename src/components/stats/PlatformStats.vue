<script setup lang="ts">
import { platformMapping } from '@/variables/mappings';
import { useDataStore } from '@/stores/data';
import type { BaseDiscovererData } from '@/types/data';
import { storeToRefs } from 'pinia';
import { computed, reactive, ref, watch } from 'vue';
import { getPercentage } from '@/helpers/maths';
import type { QTable, QTableColumn } from 'quasar';
import type { PaginationObject } from '@/types/pagination';
import { formatPercentage } from '@/helpers/formatting';

const dataStore = useDataStore();
const { filteredData, dataLength, amountTagged } = storeToRefs(dataStore);

interface PlatformData {
  [key: string]: BaseDiscovererData;
}

interface PlayerData {
  Steam: Set<string>;
  PlayStation: Set<string>;
  Xbox: Set<string>;
  GOG: Set<string>;
  'Nintendo Switch': Set<string>;
}

const platformTable = ref<QTable | null>(null);

const pagination = ref<PaginationObject>({
  sortBy: 'discoveries',
  descending: true,
  page: 1,
  rowsPerPage: 0,
});

const platformStats = computed(() => {
  const playerData: PlayerData = {
    Steam: new Set(),
    PlayStation: new Set(),
    Xbox: new Set(),
    GOG: new Set(),
    'Nintendo Switch': new Set(),
  };

  const platformData: PlatformData = {};

  for (const data of filteredData.value) {
    if (!data.Platform) continue;
    const platform = platformMapping[data.Platform];
    const platformObject = (platformData[platform] ??= {
      players: 0,
      discoveries: 0,
      discPercent: 0,
      tagged: 0,
      taggedPercent: 0,
      taggedPercentSelf: 0,
    });
    platformObject.discoveries++;
    if (data['Correctly Prefixed']) platformObject.tagged++;
    playerData[platform].add(data.Discoverer);
    platformObject.players = playerData[platform].size;
    platformObject.discPercent = getPercentage(platformObject.discoveries, dataLength.value);
    platformObject.taggedPercent = getPercentage(platformObject.tagged, amountTagged.value);
    platformObject.taggedPercentSelf = getPercentage(platformObject.tagged, platformObject.discoveries);
  }

  const discovererDataArray: BaseDiscovererData[] = Object.entries(platformData).map(([platform, stats]) => ({
    platform,
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
    name: 'platform',
    label: 'Platform',
    align: 'left',
    field: 'platform',
    sortable: true,
  },
  {
    name: 'players',
    label: 'Players',
    align: 'left',
    field: 'players',
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
  [() => pagination.value.sortBy, () => pagination.value.descending, () => platformTable.value?.filteredSortedRows],
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
    v-if="platformStats.length"
    label="Platform Stats"
    default-opened
  >
    <QTable
      v-model:pagination="pagination"
      :columns
      :rows="platformStats"
      column-sort-order="da"
      ref="platformTable"
      binary-state-sort
      flat
      hide-bottom
    />
  </QExpansionItem>
</template>
