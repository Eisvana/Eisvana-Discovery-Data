<script setup lang="ts">
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { computedWithControl, refDebounced } from '@vueuse/core';
import { debounceDelay } from '@/variables/debounce';
import { chartOptions } from '@/variables/chart';
import { categoryMapping } from '@/variables/mappings';
import type { DiscoveryCategories, DiscoveryData } from '@/types/data';
import PieChartWrapper from '../PieChartWrapper.vue';
import { useFilterStore } from '@/stores/filter';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const dataStore = useDataStore();
const { filteredData, isLoading } = storeToRefs(dataStore);

const filterStore = useFilterStore();
const { sortedCategories } = storeToRefs(filterStore);

const debouncedFilteredData = refDebounced<DiscoveryData[]>(filteredData, debounceDelay);

const categoryData = computedWithControl(debouncedFilteredData, () => {
  const labels = sortedCategories.value;
  const colours = labels.map((cat) => categoryMapping[cat].colour);

  const categoryCounters: Partial<Record<DiscoveryCategories, number>> = {};
  labels.forEach((cat) => (categoryCounters[cat] = 0));

  // prettier-ignore
  for (let i = 0; i < debouncedFilteredData.value.length; i++) {  // NoSonar this is for performance
    const item = debouncedFilteredData.value[i];
    const category = item.Category;
    if (categoryCounters[category] !== undefined) categoryCounters[category]++;
  }

  return {
    colours,
    labels,
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
