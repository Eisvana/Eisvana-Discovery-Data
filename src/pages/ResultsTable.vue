<script setup lang="ts">
import TableHeaders from '@/components/table/TableHeaders.vue';
import { platformMapping } from '@/variables/mappings';
import { useDataStore } from '@/stores/data';
import type { DiscoveryData, TableHeadings } from '@/types/data';
import type { Platform } from '@/types/platform';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { getFormattedUTCDateString } from '@/helpers/date';
import { isPlatformCode } from '@/helpers/typeGuards';
import Pagination from '@/components/table/Pagination.vue';

const dataStore = useDataStore();
const { filteredData, isLoading } = storeToRefs(dataStore);

interface TextArray {
  text: string;
  className: string;
}

const getFullPlatform = (platform: Platform) => platformMapping[platform];

const paginatedData = ref<DiscoveryData[]>([]);

const dataArray = computed(() => {
  const textArray: TextArray[] = [];
  for (const data of paginatedData.value ?? []) {
    const entries: [string, number | string | boolean][] = Object.entries(data);
    for (const [key, value] of entries) {
      let text: string = '';
      let className: string = '';

      switch (key) {
        case 'Name':
          text = value.toString() || 'Unknown (procedural name)';
          if (!value) className = 'italic';
          break;

        case 'Platform':
          text = isPlatformCode(value) ? getFullPlatform(value) : '';
          break;

        case 'Timestamp':
          text = typeof value !== 'boolean' ? getFormattedUTCDateString(value) : '';
          break;

        case 'Correctly Prefixed':
          text = `${Boolean(value).toString().charAt(0).toUpperCase()}${Boolean(value).toString().slice(1)}`;
          break;

        default:
          text = value.toString();
          if (key === 'Glyphs') className = 'glyphs';
          break;
      }

      const newObj = {
        text,
        className,
      };

      textArray.push(newObj);
    }
  }
  return textArray;
});

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
      <div
        v-for="obj in dataArray"
        :class="obj.className"
      >
        {{ obj.text }}
      </div>
    </div>
  </div>
  <div
    v-else
    :aria-busy="isLoading"
  ></div>
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

    .italic {
      font-style: italic;
    }
  }
}
</style>
