<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const dataStore = useDataStore();
const { filteredData } = storeToRefs(dataStore);

const discovererStats = computed(() => {
  const discovererData: { [key: string]: number } = {};

  for (const data of filteredData.value) {
    if (!data.Discoverer) continue;
    discovererData[data.Discoverer] ??= 0;
    discovererData[data.Discoverer]++;
  }

  const sortingArray = Object.entries(discovererData);

  sortingArray.sort((a, b) => b[1] - a[1]);

  const numberOfBars = 45;
  const topDiscoverers = sortingArray.slice(0, numberOfBars);

  const finalObject = Object.fromEntries(topDiscoverers);

  return {
    keys: Object.keys(finalObject),
    values: Object.values(finalObject),
  };
});

const chartData = computed(() => ({
  labels: discovererStats.value.keys,
  datasets: [
    {
      label: 'Discoveries per Player',
      backgroundColor: '#1095C1',
      data: discovererStats.value.values,
    },
  ],
}));

const options = {
  responsive: true,
  maintainAspectRatio: true,
};
</script>

<template>
  <Bar
    :data="chartData"
    :options="options"
  />
</template>
