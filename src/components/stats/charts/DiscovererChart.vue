<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import {  categoryMapping, chartColours } from '@/variables/mappings';
import type { DiscovererData, DiscovererDataArray } from '@/types/data';
import { paginateData } from '@/helpers/paginate';
import PaginationControls from '@/components/PaginationControls.vue';
import { chartOptions } from '@/variables/chart';
import { refDebounced } from '@vueuse/core';
import { debounceDelay } from '@/variables/debounce';
import { useFilterStore } from '@/stores/filter';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const dataStore = useDataStore();
const { filteredData } = storeToRefs(dataStore);

const filterStore = useFilterStore();
const { sortedCategories } = storeToRefs(filterStore);

const debouncedFilteredData = refDebounced(filteredData, debounceDelay);

const itemsPerPage = ref(50); // NoSonar this is one of the three possible itemsPerRow options
const currentPage = ref(1);
const currentPageIndex = computed(() => currentPage.value - 1);

const discovererStats = computed(() => {
  const discovererData: DiscovererData = {};

  // prettier-ignore
  for (let i = 0; i < debouncedFilteredData.value.length; i++) {  // NoSonar this is for performance
    const data = debouncedFilteredData.value[i];
    const discoverer = data.Discoverer;
    if (!discoverer) continue;

    const discovererObject = (discovererData[discoverer] ??= {
      discoveries: 0,
      tags: 0,
      mistags: 0,
    });

    discovererObject.discoveries++;
    const entryCategory = data.Category;
    sortedCategories.value.forEach((cat) => (discovererObject[cat] ??= 0));
    if (discovererObject[entryCategory] !== undefined) discovererObject[entryCategory]++;

    if (data['Correctly Prefixed']) {
      discovererObject.tags++;
    } else {
      discovererObject.mistags++;
    }
  }

  const discovererDataArray = Object.entries(discovererData);

  const sortedDiscovererDataArray = discovererDataArray.toSorted((a, b) => b[1].discoveries - a[1].discoveries);

  const joinedData: DiscovererDataArray[] = sortedDiscovererDataArray.map(([name, data]) => ({ name, ...data }));
  return joinedData;
});

const paginatedData = computed(() => paginateData(discovererStats.value, itemsPerPage.value, currentPageIndex.value));

const barChartData = computed(() => {
  const playerNames: string[] = paginatedData.value.map((item) => item.name);

  const datasets: {
    label: string;
    backgroundColor: string;
    data: number[];
  }[] = [];

  if (sortedCategories.value[0] === 'SolarSystem' && sortedCategories.value.length === 1) {
    const playerTags: number[] = paginatedData.value.map((item) => item.tags);
    const playerMistags: number[] = paginatedData.value.map((item) => item.mistags);
    datasets.push(
      {
        label: 'Tagged',
        backgroundColor: chartColours.blue,
        data: playerTags,
      },
      {
        label: 'Not Tagged',
        backgroundColor: chartColours.red,
        data: playerMistags,
      }
    );
  } else {
    const mappedDatasets = sortedCategories.value.map((cat) => {
      const categoryDiscoveries = paginatedData.value.map((item) => item[cat] ?? 0);
      return {
        label: categoryMapping[cat].label,
        backgroundColor: sortedCategories.value.length === 1 ? chartColours.blue : categoryMapping[cat].colour,
        data: categoryDiscoveries,
      };
    });
    datasets.push(...mappedDatasets);
  }

  return {
    labels: playerNames,
    datasets,
  };
});

const barChartOptions = {
  ...chartOptions,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};
</script>

<template>
  <!--Discoveries and prefixes per player-->
  <PaginationControls
    v-model:currentPage="currentPage"
    v-model:itemsPerPage="itemsPerPage"
    :data="discovererStats"
  />

  <Bar
    :data="barChartData"
    :options="barChartOptions"
    class="chart"
  />
</template>
