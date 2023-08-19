<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import type { DiscovererData } from '@/types/data';
import { ChartColours } from '@/objects/mappings';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const dataStore = useDataStore();
const { filteredData } = storeToRefs(dataStore);

const discovererStats = computed(() => {
  const discovererData: DiscovererData = {};

  for (const data of filteredData.value) {
    if (!data.Discoverer) continue;
    const discovererObject = (discovererData[data.Discoverer] ??= {
      discoveries: 0,
      tags: 0,
    });
    discovererObject.discoveries++;
    if (data['Correctly Tagged']) discovererObject.tags++;
  }

  const discoveryNumbers: number[] = Object.values(discovererData).map((item) => item.discoveries);

  const counts: { [key: number]: number } = {};

  for (const num of discoveryNumbers) {
    counts[num] ??= 0;
    counts[num]++;
  }

  return counts;
});

const chartData = computed(() => {
  return {
    labels: Object.keys(discovererStats.value),
    datasets: [
      {
        label: 'Players with contribution',
        backgroundColor: ChartColours.blue,
        data: Object.values(discovererStats.value),
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
};
</script>

<template>
  <details>
    <summary>Average contributions</summary>
    <Bar
      :data="chartData"
      :options="chartOptions"
    />
  </details>
</template>
