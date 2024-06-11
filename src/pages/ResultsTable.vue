<script setup lang="ts">
import { getFormattedUTCDateString } from '@/helpers/date';
import { getPlatform } from '@/helpers/platform';
import { useDataStore } from '@/stores/data';
import type { DiscoveryData } from '@/types/data';
import type { Platform } from '@/types/platform';
import { storeToRefs } from 'pinia';
import { computed, ref, reactive } from 'vue';
import type { QTableProps } from 'quasar';

const dataStore = useDataStore();
const { filteredData, isLoading } = storeToRefs(dataStore);

const capitaliseFirst = (str: string) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

const pagination = ref();

const requiredCols = ref(['name', 'glyphs', 'discoverer', 'platform', 'date']);

const discovererColName = computed(() => {
  const isBase = (item: DiscoveryData) => 'Parts' in item;

  const allHaveBuilder = filteredData.value.some(isBase);
  if (allHaveBuilder) return 'Builder';

  const someHaveBuilder = filteredData.value.every(isBase);
  if (someHaveBuilder) return 'Discoverer / Builder';

  return 'Discoverer';
});

const columns = reactive([
  {
    name: 'name',
    label: 'Name',
    align: 'left',
    field: 'Name',
    format: (name: string) => name || 'Unknown (procedural name)',
    classes: (row: DiscoveryData) => (row.Name ? '' : 'italic'),
  },
  {
    name: 'glyphs',
    label: 'Glyphs',
    field: 'Glyphs',
    align: 'left',
    classes: 'glyphs glyphs-cell',
  },
  {
    name: 'discoverer',
    label: discovererColName,
    align: 'left',
    field: 'Discoverer',
  },
  {
    name: 'platform',
    label: 'Platform',
    align: 'left',
    field: 'Platform',
    format: (val: Platform) => getPlatform(val),
  },
  {
    name: 'date',
    label: 'Date',
    align: 'left',
    field: 'Timestamp',
    format: (val: number) => getFormattedUTCDateString(val),
  },
  {
    name: 'prefixed',
    label: 'Correctly Prefixed',
    field: 'Correctly Prefixed',
    align: 'left',
    sortable: true,
    format: (val: boolean) => capitaliseFirst(val.toString()),
  },
  {
    name: 'fauna',
    label: 'Fauna',
    field: 'Fauna',
    align: 'left',
    sortable: true,
  },
  {
    name: 'flora',
    label: 'Flora',
    field: 'Flora',
    align: 'left',
    sortable: true,
  },
  {
    name: 'minerals',
    label: 'Minerals',
    field: 'Minerals',
    align: 'left',
    sortable: true,
  },
  {
    name: 'settlements',
    label: 'Settlements',
    field: 'Settlements',
    align: 'left',
    sortable: true,
  },
  {
    name: 'bases',
    label: 'Bases',
    field: 'Bases',
    align: 'left',
    sortable: true,
  },
  {
    name: 'mode',
    label: 'Gamemode',
    field: 'Gamemode',
    align: 'left',
    sortable: true,
  },
  {
    name: 'parts',
    label: 'Parts',
    field: 'Parts',
    align: 'left',
    sortable: true,
  },
]);

const rowsPerPage = [10, 50, 100, 500, 1000, 0]; // NoSonar these show how many items are displayed on the page at once. The user can switch between them
</script>

<template>
  <div class="table-wrapper">
    <QTable
      :columns
      :loading="isLoading"
      :rows="filteredData"
      :rows-per-page-options="rowsPerPage"
      :visible-columns="requiredCols"
      class="my-sticky-header-table"
      row-key="glyphs"
      flat
      v-model:pagination="pagination"
    >
      <template v-slot:body-cell-name="props">
        <QTd :props="props">
          <RouterLink :to="`/system/${props.row.Glyphs}`">{{
            props.row.Name || 'Unknown (procedural name)'
          }}</RouterLink>
        </QTd>
      </template>
    </QTable>
    <!--
    <div class="data-table">
      <TableHeaders :headers />
      <template v-for="obj in paginatedData">
        <div :class="{ italic: !obj.Name }">

        </div>
        <div class="glyphs">
          {{ obj.Glyphs }}
        </div>
        <div>
          {{ obj.Discoverer }}
        </div>
        <div>
          {{ getPlatform(obj.Platform) }}
        </div>
        <div>
          {{ getFormattedUTCDateString(obj.Timestamp) }}
        </div>
        <div>
          {{ capitaliseFirst(obj['Correctly Prefixed']?.toString() ?? '') }}
        </div>
      </template>
    </div> -->
  </div>
</template>

<style scoped lang="scss">
:deep(.glyphs-cell) {
  font-size: 2rem;
}
</style>
