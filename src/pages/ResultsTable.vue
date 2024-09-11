<script setup lang="ts">
import { getFormattedUTCDateString } from '@/helpers/date';
import { getPlatform } from '@/helpers/platform';
import { useDataStore } from '@/stores/data';
import type { DiscoveryCategories, DiscoveryData } from '@/types/data';
import type { Platform } from '@/types/platform';
import { storeToRefs } from 'pinia';
import { computed, ref, reactive, watch, watchEffect } from 'vue';
import { format, QTable, type QTableColumn } from 'quasar';
import type { PaginationObject } from '@/types/pagination';
import { rowsPerPage } from '@/variables/pagination';
import SkeletonTable from '@/components/SkeletonTable.vue';
import FadeTransition from '@/components/FadeTransition.vue';
import { unknownName } from '@/variables/table';
import { categoryMapping } from '@/variables/mappings';

const dataStore = useDataStore();
const { filteredData, isLoading } = storeToRefs(dataStore);

const { capitalize } = format;

const pagination = ref<PaginationObject>({
  sortBy: null,
  descending: false,
  page: 1,
  rowsPerPage: 50,
});

// go to first page on every load event
watch(isLoading, () => (pagination.value.page = 1));

const table = ref<QTable | null>(null);

const currentItems = computed(() => [...(table.value?.computedRows ?? [])]);

const requiredCols = computed(() => updateRequiredCols(currentItems.value));

const discovererColLabel = computed(() => {
  const isBase = (item: DiscoveryData) => item.Category === 'Base';

  const noneHaveBuilder = !currentItems.value.some(isBase);
  if (noneHaveBuilder) return 'Discoverer';

  const someDontHaveBuilder = currentItems.value.some((item) => !isBase(item));
  if (someDontHaveBuilder) return 'Discoverer / Builder';

  return 'Builder';
});

const columns: QTableColumn<DiscoveryData>[] = reactive([
  {
    name: 'name',
    label: 'Name',
    align: 'left',
    field: 'Name',
    classes: (row: DiscoveryData) => (row.Name ? '' : 'text-italic'),
    sortable: true,
  },
  {
    name: 'glyphs',
    label: 'Glyphs',
    field: 'Glyphs',
    align: 'left',
    classes: 'glyphs glyphs-cell',
    sortable: true,
  },
  {
    name: 'category',
    label: 'Category',
    field: 'Category',
    format: (cat: DiscoveryCategories) => categoryMapping[cat].label,
    align: 'left',
    sortable: true,
  },
  {
    name: 'discoverer',
    label: discovererColLabel,
    align: 'left',
    field: 'Discoverer',
    sortable: true,
  },
  {
    name: 'platform',
    label: 'Platform',
    align: 'left',
    field: 'Platform',
    format: (val: Platform) => getPlatform(val) ?? '',
    sortable: true,
  },
  {
    name: 'date',
    label: 'Date',
    align: 'left',
    field: 'Timestamp',
    format: (val: number | undefined) => (val ? getFormattedUTCDateString(val) : ''),
    sortable: true,
  },
  {
    name: 'planets',
    label: 'Planets',
    field: 'Planets',
    align: 'left',
    sortable: true,
  },
  {
    name: 'prefixed',
    label: 'Correctly Prefixed',
    field: 'Correctly Prefixed',
    align: 'left',
    sortable: true,
    format: (val: boolean | undefined) => (typeof val === 'boolean' ? capitalize(val.toString()) : ''), // doing a comparison because `false` is a falsy value (obviously) and would therefore lead to some systems not showing their tagging status
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
    name: 'bases',
    label: 'Bases',
    field: 'Bases',
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

function updateRequiredCols(newItems: DiscoveryData[]) {
  const allFields = columns.map((item) => item.field);
  const usedFields = allFields.filter((field) => typeof field === 'string' && newItems.some((item) => field in item));

  // this is a stupid helper function that is necessary because TS currently cannot infer that .filter(Boolean) removes undefined values
  const isString = (item: unknown): item is string => typeof item === 'string';

  const usedFieldColNames = usedFields
    .map((field) => columns.find((item) => item.field === field)?.name)
    .filter(isString); // see comment above for why this is not done with `Boolean`

  return usedFieldColNames;
}

watchEffect(() => console.log(requiredCols.value));
</script>

<template>
  <FadeTransition :condition="!isLoading">
    <template #default>
      <QTable
        v-model:pagination="pagination"
        :columns
        :loading="isLoading"
        :rows="filteredData"
        :rows-per-page-options="rowsPerPage"
        :visible-columns="requiredCols"
        column-sort-order="da"
        ref="table"
        table-header-class="table-header"
        flat
      >
        <template v-slot:body-cell-name="props">
          <QTd :props>
            <RouterLink
              v-if="props.row.Category === 'Planet' || props.row.Category === 'SolarSystem'"
              :to="`/${props.row.Category === 'Planet' ? 'planet' : 'system'}/${props.row.Glyphs}`"
              class="link-colour"
              >{{ props.row.Name || unknownName }}</RouterLink
            >
            <template v-else>{{ props.row.Name || unknownName }}</template>
          </QTd>
        </template>
      </QTable>
    </template>

    <template #else>
      <SkeletonTable :data-length="10" />
    </template>
  </FadeTransition>
</template>

<style scoped lang="scss">
:deep(.glyphs-cell) {
  font-size: 2rem;
}
</style>
