<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { useFilterStore } from '@/stores/filter';
import type { DiscoveryData } from '@/types/data';
import { storeToRefs } from 'pinia';
import { ref, toRaw, watchEffect } from 'vue';
import { watchDebounced } from '@vueuse/core';
import type { FilterConfig, WorkerMessage, WorkerResponse } from '@/types/worker';
import DataLoaderWorker from '@/worker/dataLoaderWorker?worker';
import { debounceDelay } from '@/variables/debounce';

const filterStore = useFilterStore();
const dataStore = useDataStore();

const {
  unixTimestamp,
  tagged,
  intersections,
  searchTerms,
  caseSensitivity,
  sortedCategories,
  platforms,
  sortedRegions,
} = storeToRefs(filterStore);
const { filteredData, isLoading } = storeToRefs(dataStore);

const temporaryData = ref<DiscoveryData[][]>([]);

const workers: Worker[] = [];

watchEffect(() => {
  const newData = temporaryData.value.flat();
  if (isLoading.value && !newData.length) return;
  filteredData.value = newData;
});

watchDebounced(
  [unixTimestamp, tagged, intersections, searchTerms, caseSensitivity, sortedRegions, platforms, sortedCategories],
  loadData,
  { deep: true, immediate: true, debounce: debounceDelay }
);

function loadData() {
  console.time();

  workers.forEach((worker) => worker.terminate());
  workers.length = 0;

  isLoading.value = true;

  const reactiveFilterData = {
    regions: sortedRegions,
    unixTimestamp,
    tagged,
    intersections,
    searchTerms,
    caseSensitivity,
    platforms,
  };

  const filterDataArray = Object.entries(reactiveFilterData).map((item) => [item[0], toRaw(item[1].value)]);
  const filterConfig: FilterConfig = Object.fromEntries(filterDataArray);

  const workerMessage: WorkerMessage = {
    categories: toRaw(sortedCategories.value),
    regions: filterConfig.regions,
    filterConfig,
  };

  const dataLoaderWorker = new DataLoaderWorker();
  workers.push(dataLoaderWorker);
  dataLoaderWorker.postMessage(workerMessage);
  dataLoaderWorker.onmessage = ({ data: responseData }: MessageEvent<WorkerResponse>) => {
    const { status } = responseData;
    switch (status) {
      case 'initialised':
        temporaryData.value = responseData.data;
        break;

      case 'running':
        temporaryData.value[responseData.index] = responseData.data;
        break;

      case 'finished':
        isLoading.value = false;
        workers.length = 0;
        console.timeEnd();
        break;
    }
  };
}
</script>

<template>
  <QCard bordered>
    <QBtn
      class="full-width"
      label="Reset Filter"
      type="reset"
      flat
      @click="filterStore.resetStore"
    />
  </QCard>
</template>
