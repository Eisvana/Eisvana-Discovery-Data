<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const dataStore = useDataStore();
const { filteredData } = storeToRefs(dataStore);

interface DiscovererData {
  [key: string]: {
    discoveries: number;
    tags: number;
  };
}

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

  const sortedDiscovererArray = Object.entries(discovererData);

  sortedDiscovererArray.sort((a, b) => b[1].discoveries - a[1].discoveries);

  const discoverersToShow = 45;
  const topDiscoverers = sortedDiscovererArray.slice(0, discoverersToShow);

  const discovererStatsObject = Object.fromEntries(topDiscoverers);

  return {
    names: Object.keys(discovererStatsObject),
    tags: Object.values(discovererStatsObject).map((item) => item.tags),
    incorrect: Object.values(discovererStatsObject).map((item) => item.discoveries - item.tags),
  };
});

const chartData = computed(() => ({
  labels: discovererStats.value.names,
  datasets: [
    {
      label: 'Tagged',
      backgroundColor: '#1095C1',
      data: discovererStats.value.tags,
    },
    {
      label: 'Not Tagged',
      backgroundColor: '#e85123',
      data: discovererStats.value.incorrect,
    },
  ],
}));

const options = {
  responsive: true,
  maintainAspectRatio: true,
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
  <Bar
    v-if="filteredData.length"
    :data="chartData"
    :options="options"
  />
</template>
