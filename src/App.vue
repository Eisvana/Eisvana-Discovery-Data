<script setup lang="ts">
import ThemeSwitch from './components/ThemeSwitch.vue';
import PageFooter from './components/PageFooter.vue';
import NavBar from './components/NavBar.vue';
import router from './router';
import { useDataStore } from './stores/data';
import { storeToRefs } from 'pinia';
import type { DiscoveryData } from './types/data';
import { onMounted, ref, toRaw, watchEffect } from 'vue';
import DataLoaderWorker from '@/worker/dataLoaderWorker?worker';
import type { FilterConfig, LoaderWorkerMessage, LoaderWorkerResponse } from './types/worker';
import { useFilterStore } from './stores/filter';
import type { GlobalCustomEvents } from './types/events';

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

router.beforeResolve(() => (isLoading.value = true));

router.afterEach(() => {
  const transitionDuration = 300;
  setTimeout(() => (isLoading.value = false), transitionDuration);
});

const temporaryData = ref<DiscoveryData[][]>([]);

const workers: Worker[] = [];

watchEffect(() => {
  const newData = temporaryData.value.flat();
  if (isLoading.value && !newData.length) return;
  filteredData.value = newData;
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

onMounted(loadData);

const registerVanillaGlobalEventListener = (eventName: GlobalCustomEvents, func: () => void) =>
  document.addEventListener(eventName, func);

registerVanillaGlobalEventListener('filter', loadData);
registerVanillaGlobalEventListener('reset', resetFilter);
</script>

<template>
  <QLayout view="hHh LpR fff">
    <QHeader
      class="bg-primary text-white"
      elevated
    >
      <QToolbar>
        <NavBar />

        <QSpace class="xs" />

        <QToolbarTitle class="text-center gt-xs">
          <h1>Eisvana Discovery Data</h1>
        </QToolbarTitle>

        <ThemeSwitch />
      </QToolbar>
      <QToolbar class="xs">
        <QToolbarTitle class="text-center">
          <h1>Eisvana Discovery Data</h1>
        </QToolbarTitle>
      </QToolbar>
    </QHeader>

    <QPageContainer>
      <QPage padding>
        <RouterView />
      </QPage>
    </QPageContainer>

    <QFooter
      class="bg-grey-8 text-white text-center"
      elevated
    >
      <PageFooter />
    </QFooter>
  </QLayout>
</template>

<style scoped lang="scss">
h1 {
  all: unset;
}
</style>
