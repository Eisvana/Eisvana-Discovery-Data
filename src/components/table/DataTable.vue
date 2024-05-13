<script setup lang="ts">
import type { orders } from '@/variables/mappings';
import type { TableHeadings } from '@/types/data';
import type { ValueOf } from '@/types/utility';
import TableHeaders from './TableHeaders.vue';
import { computed } from 'vue';

const props = defineProps<{
  headers: TableHeadings;
  sorting?: { col: number; order: ValueOf<typeof orders> };
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
      :headers
      :sorting
    />
    <div v-for="text in data">
      {{ text }}
    </div>
  </div>
</template>
