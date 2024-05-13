<script setup lang="ts">
import type { orders } from '@/variables/mappings';
import type { TableHeadings } from '@/types/data';
import type { ValueOf } from '@/types/utility';
import { sortByColumn } from '@/helpers/sorting';

defineProps<{
  headers: TableHeadings;
  sorting?: { col: number; order: ValueOf<typeof orders> };
}>();
</script>

<template>
  <div
    v-for="header in headers.normal"
    class="table-header"
  >
    {{ header }}
  </div>
  <div
    v-if="sorting"
    v-for="header in headers.sortable"
    class="table-header sortable"
    @click="sortByColumn($event, sorting)"
  >
    {{ header }}
  </div>
</template>
