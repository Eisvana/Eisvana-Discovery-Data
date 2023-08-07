<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { ChartColours, PlatformMapping } from '@/objects/mappings';
import type { Platform } from '@/types/data';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const dataStore = useDataStore();
const { filteredData } = storeToRefs(dataStore);

interface PlatformData {
  [key: string]: {
    discoveries: number;
    tags: number;
  };
}

const platformStats = computed(() => {
  const platformData: PlatformData = {};

  for (const data of filteredData.value) {
    if (!data.Platform) continue;
    const platformObject = (platformData[data.Platform] ??= {
      discoveries: 0,
      tags: 0,
    });
    platformObject.discoveries++;
    if (data['Correctly Tagged']) platformObject.tags++;
  }

  const sortedPlatformArray = Object.entries(platformData);

  sortedPlatformArray.sort((a, b) => b[1].discoveries - a[1].discoveries);

  const platformStatsObject = Object.fromEntries(sortedPlatformArray);

  return {
    platforms: Object.keys(platformStatsObject).map((item) => PlatformMapping[item as Platform]),
    tags: Object.values(platformStatsObject).map((item) => item.tags),
    incorrect: Object.values(platformStatsObject).map((item) => item.discoveries - item.tags),
  };
});

const chartData = computed(() => ({
  labels: platformStats.value.platforms,
  name: 'Test',
  datasets: [
    {
      label: 'Tagged',
      backgroundColor: ChartColours.blue,
      data: platformStats.value.tags,
    },
    {
      label: 'Not Tagged',
      backgroundColor: ChartColours.red,
      data: platformStats.value.incorrect,
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
  <details>
    <summary>Discoveries and Hub tags per platform</summary>
    <Bar
      :data="chartData"
      :options="options"
    />
  </details>
</template>
