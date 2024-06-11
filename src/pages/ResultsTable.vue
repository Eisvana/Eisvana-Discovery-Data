<script setup lang="ts">
import { getFormattedUTCDateString } from '@/helpers/date';
import { getPlatform } from '@/helpers/platform';
import { useDataStore } from '@/stores/data';
import type { DiscoveryData } from '@/types/data';
import type { Platform } from '@/types/platform';
import { storeToRefs } from 'pinia';
import { computed, ref, reactive, watch, watchEffect } from 'vue';
import type { QTableProps } from 'quasar';

interface PaginationObject {
  sortBy: string | null;
  descending: boolean;
  page: number;
  rowsPerPage: number;
  rowsNumber?: number;
}

const dataStore = useDataStore();
const { filteredData, isLoading } = storeToRefs(dataStore);

const capitaliseFirst = (str: string) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

const rowsPerPage = [10, 50, 100, 500, 1000, 0]; // NoSonar these show how many items are displayed on the page at once. The user can switch between them
const requiredCols = ref(['name', 'glyphs', 'discoverer', 'platform', 'date']);

const currentItems = ref<DiscoveryData[]>([]);
const pagination = ref<PaginationObject>({
  sortBy: null,
  descending: false,
  page: 1,
  rowsPerPage: 50,
});

const discovererColName = computed(() => {
  const isBase = (item: DiscoveryData) => 'Parts' in item;

  const allHaveBuilder = currentItems.value.every(isBase);
  if (allHaveBuilder) return 'Builder';

  const someHaveBuilder = currentItems.value.some(isBase);
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
    classes: (row: DiscoveryData) => (row.Name ? '' : 'text-italic'),
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
    format: (val: number | undefined) => (val ? getFormattedUTCDateString(val) : ''),
  },
  {
    name: 'prefixed',
    label: 'Correctly Prefixed',
    field: 'Correctly Prefixed',
    align: 'left',
    sortable: true,
    format: (val: boolean | undefined) => (typeof val === 'boolean' ? capitaliseFirst(val.toString()) : ''), // doing a comparison because `false` is a falsy value (obviously) and would therefore lead to some systems not showing their tagging status
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

function updateCurrentItems(newPagination: PaginationObject) {
  const { rowsPerPage, page } = newPagination;
  const minIndex = (page - 1) * rowsPerPage;
  const maxIndex = page * rowsPerPage;

  currentItems.value = filteredData.value.slice(minIndex, maxIndex);
}

function updateRequiredCols(newItems: DiscoveryData[]) {
  const allFields = columns.map((item) => item.field);
  const usedFields = allFields.filter((field) => newItems.some((item) => field in item));

  // this is a stupid helper function that is necessary because TS currently cannot infer that .filter(Boolean) removes undefined values
  const isStringArray = (item: unknown): item is string => typeof item === 'string';

  const usedFieldColNames = usedFields
    .map((field) => columns.find((item) => item.field === field)?.name)
    .filter(isStringArray);

  requiredCols.value = usedFieldColNames;
}

watch([pagination, filteredData], ([newPagination]) => updateCurrentItems(newPagination));
watchEffect(() => updateRequiredCols(currentItems.value));
</script>

<template>
  <div class="table-wrapper">
    <QTable
      v-model:pagination="pagination"
      :columns
      :loading="isLoading"
      :rows="filteredData"
      :rows-per-page-options="rowsPerPage"
      :visible-columns="requiredCols"
      row-key="glyphs"
      table-header-class="table-header"
      flat
    >
      <template v-slot:body-cell-name="props">
        <QTd :props="props">
          <RouterLink
            v-if="'Bases' in props.row || 'Correctly Prefixed' in props.row"
            :to="`/${'Bases' in props.row ? 'planet' : 'system'}/${props.row.Glyphs}`"
            >{{ props.row.Name || 'Unknown (procedural name)' }}</RouterLink
          >
          <template v-else>{{ props.row.Name }}</template>
        </QTd>
      </template>
    </QTable>
  </div>
</template>

<style scoped lang="scss">
:deep(.glyphs-cell) {
  font-size: 2rem;
}
</style>
