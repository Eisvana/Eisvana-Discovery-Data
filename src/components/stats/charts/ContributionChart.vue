<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { chartColours } from '@/variables/mappings';
import ChartWrapper from '@/components/ChartWrapper.vue';
import { computed } from 'vue';
import { chartOptions } from '@/variables/chart';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const dataStore = useDataStore();
const { filteredData } = storeToRefs(dataStore);

const discovererStats = computed(() => {
  const discoveriesPerPlayer: Record<string, number> = {};

  for (const data of filteredData.value) {
    if (!data.Discoverer) continue;
    discoveriesPerPlayer[data.Discoverer] ??= 0;
    discoveriesPerPlayer[data.Discoverer]++;
  }

  const discoveryNumbers: number[] = Object.values(discoveriesPerPlayer);

  const counts: Record<number, number> = {};

  for (const num of discoveryNumbers) {
    counts[num] ??= 0;
    counts[num]++;
  }

  return counts;
});

const chartData = computed(() => ({
  labels: Object.keys(discovererStats.value),
  datasets: [
    {
      label: 'Players with contribution',
      backgroundColor: chartColours.blue,
      data: Object.values(discovererStats.value),
    },
  ],
}));
</script>

<template>
  <ChartWrapper
    group="chart"
    summary="Average contributions"
  >
    <Bar
      :data="chartData"
      :options="chartOptions"
      class="chart"
    />
  </ChartWrapper>
</template>
