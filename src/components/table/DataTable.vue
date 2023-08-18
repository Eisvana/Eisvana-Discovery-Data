<script setup lang="ts">
import type { Orders } from '@/objects/mappings';
import type { TableHeadings } from '@/types/data';
import TableHeaders from './TableHeaders.vue';
import { computed } from 'vue';

const props = defineProps<{
  headers: TableHeadings;
  sorting?: { col: number; order: Orders };
  data: (string | number)[];
}>();

const headerCount = computed(() => (props.headers.normal ?? []).concat(props.headers.sortable ?? []).length);
</script>

<template>
  <div
    class="stat-grid"
    :style="{ 'grid-template-columns': `repeat(${headerCount}, auto)` }"
  >
    <TableHeaders
      :headers="headers"
      :sorting="sorting"
    />
    <div v-for="text in data">
      {{ text }}
    </div>
  </div>
</template>
