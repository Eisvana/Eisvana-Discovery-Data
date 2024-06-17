<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { useFilterStore } from '@/stores/filter';
import type { DiscoveryData } from '@/types/data';
import { storeToRefs } from 'pinia';
import { computed, ref, toRaw, watch, watchEffect } from 'vue';
import { watchDebounced } from '@vueuse/core';
import type { FilterConfig, WorkerMessage, WorkerResponse } from '@/types/worker';
import DataLoaderWorker from '@/worker/dataLoaderWorker?worker';
import { regions as allEisvanaRegions } from '@/variables/regions';

interface PathObject {
  path: string;
  isLoaded: boolean;
  index: number;
}

const filterStore = useFilterStore();
const dataStore = useDataStore();

const { unixTimestamp, tagged, intersections, searchTerms, caseSensitivity, regions, platforms, categories } =
  storeToRefs(filterStore);
const { filteredData, isLoading } = storeToRefs(dataStore);

const temporaryData = ref<DiscoveryData[][]>([]);

watchEffect(() => {
  const newData = temporaryData.value.flat();
  if (isLoading.value && !newData.length) return;
  filteredData.value = newData;
});

watchDebounced(
  [unixTimestamp, tagged, intersections, searchTerms, caseSensitivity, regions, platforms, categories],
  loadData,
  { deep: true, immediate: true, debounce: 500 }
);

const getNotLoadedFiles = (pathObj: PathObject) => !pathObj.isLoaded;

const pathsToLoad = ref<PathObject[]>([]);
const notLoadedFiles = computed(() => pathsToLoad.value.filter(getNotLoadedFiles));
const toLoad = ref<PathObject[]>([]);

// limit to 6 concurrent workers in order to work around a bug in Firefox: https://bugzilla.mozilla.org/show_bug.cgi?id=1885198
const workerLimit = 6;
const availableThreads = Math.max(navigator.hardwareConcurrency - 2, 1);
const workerThreadAmount = Math.min(workerLimit, availableThreads);

// add files to toLoad array when a thread is available
watchEffect(() => {
  if (!isLoading.value) return;
  const amountToPush = workerThreadAmount - toLoad.value.filter(getNotLoadedFiles).length;
  const pool = notLoadedFiles.value.filter((item) => !toLoad.value.includes(item)).slice(0, amountToPush);
  if (pool.length) toLoad.value = [...toLoad.value, ...pool];
});

// load new files that are added to the toLoad array
watch(toLoad, (newVal, oldVal) => {
  const filesToLoad = newVal.filter((item) => !oldVal.includes(item));
  filesToLoad.forEach(loadFile);
});

// set isLoading to false when loading finished
watchEffect(() => {
  if (!notLoadedFiles.value.length && isLoading.value) {
    isLoading.value = false;
    toLoad.value = [];
    console.timeEnd();
  }
});

async function loadData() {
  console.time();

  const animalImports = import.meta.glob('../assets/animals/*.json', { import: 'default' });
  const baseImports = import.meta.glob('../assets/bases/*.json', { import: 'default' });
  const floraImports = import.meta.glob('../assets/flora/*.json', { import: 'default' });
  const mineralImports = import.meta.glob('../assets/minerals/*.json', { import: 'default' });
  const planetImports = import.meta.glob('../assets/planets/*.json', { import: 'default' });
  const settlementImports = import.meta.glob('../assets/settlements/*.json', { import: 'default' });
  const systemImports = import.meta.glob('../assets/systems/*.json', { import: 'default' });

  const importMapping: Record<string, Record<string, () => Promise<unknown>>> = {
    creature: animalImports,
    base: baseImports,
    flora: floraImports,
    mineral: mineralImports,
    planet: planetImports,
    settlement: settlementImports,
    system: systemImports,
  };

  const regionMapping: string[] = Object.values(allEisvanaRegions);

  const activeRegionCodes = regions.value
    .map((item) => regionMapping.indexOf(item) + 1)
    .filter(Boolean)
    .map((item) => `EV${item}`);

  let index = 0;

  const imports = categories.value.flatMap((category) => {
    const paths = Object.keys(importMapping[category]); // [[path/to/file.json, () => import(file.json)], [path/to/anotherfile.json, () => import(anotherfile.json)]]
    const usedPaths = paths.filter((item) =>
      activeRegionCodes.some((regionCode) => item.endsWith(`${regionCode}.json`))
    );
    const pathObjects = usedPaths.map((path): PathObject => ({ path, isLoaded: false, index: index++ }));
    return pathObjects;
  });

  temporaryData.value = Array.from({ length: imports.length }, () => []);
  isLoading.value = false;
  toLoad.value = [];
  pathsToLoad.value = imports;
  isLoading.value = true;
}

async function loadFile(pathObj: PathObject) {
  const reactiveFilterData = {
    regions,
    unixTimestamp,
    tagged,
    intersections,
    searchTerms,
    caseSensitivity,
    platforms,
  };

  const filterDataArray = Object.entries(reactiveFilterData).map((item) => [item[0], toRaw(item[1].value)]);
  const filterConfig: FilterConfig = Object.fromEntries(filterDataArray);
  const { path, index } = pathObj;

  const data = await importFile(path, filterConfig);
  temporaryData.value[index] = data;
  pathObj.isLoaded = true;
}

async function importFile(path: string, filterConfig: FilterConfig) {
  return new Promise<DiscoveryData[]>((resolve) => {
    const workerMessage: WorkerMessage = {
      path,
      filterConfig,
    };

    const dataLoaderWorker = new DataLoaderWorker();
    dataLoaderWorker.postMessage(workerMessage);
    dataLoaderWorker.onmessage = ({ data }: MessageEvent<WorkerResponse>) => {
      resolve(data.data);
    };
  });
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
