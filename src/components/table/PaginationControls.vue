<script setup lang="ts">
import { appSections } from '@/variables/mappings';
import { useDataStore } from '@/stores/data';
import type { ValueOf } from '@/types/utility';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { clamp } from '@/helpers/maths';

const props = defineProps<{
  totalPages: number;
  section: ValueOf<typeof appSections>;
}>();

const amountSelection = [10, 50, 100, 500, 1000]; // NoSonar these show how many items are displayed on the page at once. The user can switch between them

const dataStore = useDataStore();
const { currentPageIndex, itemsPerPage } = storeToRefs(dataStore);

const pageSelectionRange = computed(() => {
  const selectionOffset = 2; // controls how many more/less pages are shown in the pagination selection
  const min = clamp(currentPageIndex.value[props.section] - selectionOffset, 0, props.totalPages - 1);
  const max = clamp(currentPageIndex.value[props.section] + selectionOffset, 0, props.totalPages - 1);

  // this creates an array with all numbers from min to max (including both)
  const numArray = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return numArray;
});

// display all items (POSITIVE_INFINITY items) if there's an error or if nothing is selected
function parsePaginationSelection(event: Event) {
  const { target } = event;
  if (!(target instanceof HTMLSelectElement)) return Number.POSITIVE_INFINITY;
  const value = target.value;
  return value ? parseInt(value) : Number.POSITIVE_INFINITY;
}
</script>

<template>
  <div class="controls">
    <label class="select-wrapper">
      <div>Results per Page:</div>
      <select
        name="paginationSelect"
        @change="itemsPerPage[section] = parsePaginationSelection($event)"
      >
        <option
          v-for="amount in amountSelection"
          :selected="itemsPerPage[section] === amount"
          :value="amount"
        >
          {{ amount }}
        </option>
        <option value="">All</option>
      </select>
    </label>
    <button
      v-if="currentPageIndex[section]"
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
    <template v-if="!pageSelectionRange.includes(totalPages - 1)">
      <div v-if="!pageSelectionRange.includes(totalPages - 2)">...</div>
      <button
        class="outline"
        @click="currentPageIndex[section] = totalPages - 1"
      >
        {{ totalPages }}
      </button>
    </template>
    <button
      v-if="currentPageIndex[section] !== totalPages - 1"
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
      background-color: var(--pico-primary-hover);
      color: var(--pico-primary-inverse);
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
