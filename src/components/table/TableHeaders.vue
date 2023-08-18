<script setup lang="ts">
import { sortByColumn } from '@/logic/logic';
import type { Orders } from '@/objects/mappings';
import type { TableHeadings } from '@/types/data';

defineProps<{
  headers: TableHeadings;
  sorting?: { col: number; order: Orders };
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
