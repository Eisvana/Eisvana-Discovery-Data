<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const props = defineProps<{
  totalItems: number;
  section: string;
}>();

const dataStore = useDataStore();
const { currentPageIndex, itemsPerPage } = storeToRefs(dataStore);

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const pageSelectionRange = computed(() => {
  const selectionOffset = 2; // controls how many more/less pages are shown in the pagination selection
  const min = clamp(currentPageIndex.value[props.section] - selectionOffset, 0, props.totalItems - 1);
  const max = clamp(currentPageIndex.value[props.section] + selectionOffset, 0, props.totalItems - 1);

  // this creates an array with all numbers from min to max (including both)
  const numArray = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return numArray;
});

function parsePaginationSelection(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  return value ? parseInt(value) : Number.POSITIVE_INFINITY;
}
</script>

<template>
  <div class="controls">
    <label class="select-wrapper">
      <div>Results per Page:</div>
      <select
        name="paginationSelect"
        id="paginationSelect"
        @change="itemsPerPage[section] = parsePaginationSelection($event)"
      >
        <option
          :selected="itemsPerPage[section] === 10"
          value="10"
        >
          10
        </option>
        <option
          :selected="itemsPerPage[section] === 50"
          value="50"
        >
          50
        </option>
        <option
          :selected="itemsPerPage[section] === 100"
          value="100"
        >
          100
        </option>
        <option
          :selected="itemsPerPage[section] === 500"
          value="500"
        >
          500
        </option>
        <option
          :selected="itemsPerPage[section] === 1000"
          value="1000"
        >
          1000
        </option>
        <option value="">All</option>
      </select>
    </label>
    <button
      v-if="currentPageIndex"
      class="outline"
      @click="currentPageIndex[section]--"
    >
      &lt;
    </button>
    <template v-if="!pageSelectionRange.includes(0)">
      <button
        class="outline"
        @click="currentPageIndex[section] = 0"
      >
        1
      </button>
      <div v-if="!pageSelectionRange.includes(1)">...</div>
    </template>
    <button
      v-for="pageNumber in pageSelectionRange"
      :class="{ outline: pageNumber !== currentPageIndex[section] }"
      @click="currentPageIndex[section] = pageNumber"
    >
      {{ pageNumber + 1 }}
    </button>
    <template v-if="!pageSelectionRange.includes(totalItems - 1)">
      <div v-if="!pageSelectionRange.includes(totalItems - 2)">...</div>
      <button
        class="outline"
        @click="currentPageIndex[section] = totalItems - 1"
      >
        {{ totalItems }}
      </button>
    </template>
    <button
      v-if="currentPageIndex[section] !== totalItems - 1"
      class="outline"
      @click="currentPageIndex[section]++"
    >
      &gt;
    </button>
  </div>
</template>

<style scoped lang="scss">
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: baseline;
  justify-content: flex-end;

  * {
    flex-basis: content;
  }

  .outline {
    &:hover,
    &:focus-visible {
      background-color: var(--primary-hover);
      color: var(--primary-inverse);
    }
  }

  .select-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: baseline;
    margin-inline-end: auto;
  }
}
</style>
