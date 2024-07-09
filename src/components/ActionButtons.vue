<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { useFilterStore } from '@/stores/filter';
import type { DiscoveryData } from '@/types/data';
import type { FilterConfig, LoaderWorkerMessage, LoaderWorkerResponse } from '@/types/worker';
import { storeToRefs } from 'pinia';
import { onMounted, ref, toRaw, watchEffect } from 'vue';
import DataLoaderWorker from '@/worker/dataLoaderWorker?worker';

const dataStore = useDataStore();
const filterStore = useFilterStore();

const {
  unixTimestamp,
  tagged,
  procName,
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

/*
I hate this.
This was done because we now have the `Apply Filter` button.
Since I don't want to `emit()` all the way to the App component, the loading logic is here.
Why not as a store action? Because that would be hard as well, given the watchers and stuff we have here (see watcher above).
Custom DOM events would have worked, but I usually try to avoid them when using a framework.
We want the data to load on pageload though. So we use `onMounted()`.
This would also trigger on navigation from a view page though (like system and planet overview pages).
But for these navigations, the `filteredData` array is not empty. On pageload, it is empty.
But because of the watcher above and the fake loading on route change, it would result in the data being blanked on route navigation from a view page.
So the `temporaryData` array must not be empty on these navigations. And we do that by copying the current `fileredData` array into it.
*/
onMounted(() => {
  temporaryData.value = [filteredData.value];
  if (!filteredData.value.length) loadData();
});

async function loadData() {
  return new Promise<void>((resolve, reject) => {
    workers.forEach((worker) => worker.terminate());
    workers.length = 0;

    isLoading.value = true;

    const reactiveFilterData = {
      regions: sortedRegions,
      unixTimestamp,
      tagged,
      procName,
      intersections,
      searchTerms,
      caseSensitivity,
      platforms,
    };

    const filterDataArray = Object.entries(reactiveFilterData).map((item) => [item[0], toRaw(item[1].value)]);
    const filterConfig: FilterConfig = Object.fromEntries(filterDataArray);

    const workerMessage: LoaderWorkerMessage = {
      categories: toRaw(sortedCategories.value),
      filterConfig,
    };

    const dataLoaderWorker = new DataLoaderWorker();
    workers.push(dataLoaderWorker);
    dataLoaderWorker.postMessage(workerMessage);
    dataLoaderWorker.onmessage = ({ data: responseData }: MessageEvent<LoaderWorkerResponse>) => {
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
          resolve();
          break;

        case 'error':
          console.warn(responseData.data);
          reject(responseData.data);
          break;
      }
    };
  });
}

function resetFilter() {
  filterStore.resetStore();
  loadData();
}
</script>

<template>
  <div class="button-wrapper q-mt-sm">
    <QBtn
      class="col-grow"
      color="primary"
      label="Apply Filter"
      @click="loadData"
    />
    <QBtn
      class="col-grow"
      label="Reset Filter"
      type="reset"
      outline
      @click="resetFilter"
    />
  </div>
</template>

<style scoped lang="scss">
.button-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
}
</style>
