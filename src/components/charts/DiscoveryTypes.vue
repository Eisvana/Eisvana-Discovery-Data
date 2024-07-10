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
import type { DiscoveryData, PartialDiscoveryCategoryNumbers } from '@/types/data';
import PieChartWrapper from '../PieChartWrapper.vue';
import { useFilterStore } from '@/stores/filter';
import ChartContainer from '../ChartContainer.vue';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const dataStore = useDataStore();
const { filteredData } = storeToRefs(dataStore);

const filterStore = useFilterStore();
const { sortedCategories } = storeToRefs(filterStore);

const debouncedFilteredData = refDebounced<DiscoveryData[]>(filteredData, debounceDelay);

const categoryData = computed(() => {
  const labels = sortedCategories.value;
  const colours = labels.map((cat) => categoryMapping[cat].colour);

  const categoryCounters: PartialDiscoveryCategoryNumbers = {};
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
  <ChartContainer>
    <PieChartWrapper>
      <Pie
        :data="pieChartData"
        :options="chartOptions"
      />
    </PieChartWrapper>
  </ChartContainer>
</template>
