<script setup lang="ts">
import TableHeaders from '@/components/table/TableHeaders.vue';
import { useDataStore } from '@/stores/data';
import type { DiscoveryData, TableHeadings } from '@/types/data';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { getFormattedUTCDateString } from '@/helpers/date';
import Pagination from '@/components/table/Pagination.vue';
import { getPlatform } from '@/helpers/platform';
import TableSkeleton from '@/components/table/TableSkeleton.vue';

const dataStore = useDataStore();
const { filteredData } = storeToRefs(dataStore);

const paginatedData = ref<DiscoveryData[]>([]);

const capitaliseFirst = (str: string) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

const headers: TableHeadings = {
  normal: ['System Name', 'Glyphs', 'Discoverer', 'Platform', 'Date', 'Tagged'],
};

const updateData = (newPaginatedArray: DiscoveryData[]) => (paginatedData.value = newPaginatedArray);
</script>

<template>
  <div
    v-if="filteredData.length"
    class="table-wrapper"
  >
    <Pagination
      :data="filteredData"
      @change="updateData"
    />
    <div class="data-table">
      <TableHeaders :headers />
      <template v-for="obj in paginatedData">
        <div :class="{ italic: !obj.Name }">
          <RouterLink :to="`/system/${obj.Glyphs}`">{{ obj.Name || 'Unknown (procedural name)' }}</RouterLink>
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
    </div>
  </div>
  <TableSkeleton v-else />
</template>

<style scoped lang="scss">
.table-wrapper {
  display: flex;
  flex-direction: column;

  .data-table {
    display: grid;
    grid-template-columns: repeat(6, auto);
    column-gap: 0.5rem;
    align-items: center;
  }
}

.spinner {
  display: block;
  margin-inline: auto;
}
</style>
