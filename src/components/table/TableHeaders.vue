<script setup lang="ts">
import { sortByColumn } from '@/logic/logic';
import type { orders } from '@/objects/mappings';
import type { TableHeadings, ValueOf } from '@/types/data';

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
