<script setup lang="ts">
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { refDebounced } from '@vueuse/core';
import { debounceDelay } from '@/variables/debounce';
import { chartOptions } from '@/variables/chart';
import { categoryMapping } from '@/variables/mappings';
import type { DiscoveryCategories, DiscoveryData } from '@/types/data';
import PieChartWrapper from '../PieChartWrapper.vue';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const dataStore = useDataStore();
const { filteredData, isLoading } = storeToRefs(dataStore);

const debouncedFilteredData = refDebounced<DiscoveryData[]>(filteredData, debounceDelay);

const categoryData = computed(() => {
  const labels = new Set<string>();
  const colours = new Set<string>();
  const categoryCounters: Partial<Record<DiscoveryCategories, number>> = {};

  // prettier-ignore
  for (let i = 0; i < debouncedFilteredData.value.length; i++) {  // NoSonar this is for performance
    const item = debouncedFilteredData.value[i];
    const { Category } = item;
    labels.add(categoryMapping[Category].label);
    colours.add(categoryMapping[Category].colour);
    categoryCounters[Category] ??= 0;
    categoryCounters[Category]++;
  }

  return {
    colours: Array.from(colours),
    labels: Array.from(labels),
    data: Object.values(categoryCounters),
  };
});

const pieChartData = computed(() => ({
  labels: categoryData.value.labels,
  datasets: [
    {
      backgroundColor: categoryData.value.colours,
      data: categoryData.value.data,
    },
  ],
}));
</script>

<template>
  <!--Discoveries per Category-->
  <PieChartWrapper>
    <Pie
      :data="pieChartData"
      :options="chartOptions"
    />
  </PieChartWrapper>

  <QInnerLoading
    :showing="isLoading"
    label="Loading Data..."
  />
</template>
