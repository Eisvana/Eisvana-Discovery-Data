<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { chartColours } from '@/variables/mappings';
import { computed, ref, watchEffect } from 'vue';
import { chartOptions } from '@/variables/chart';
import { refDebounced } from '@vueuse/core';
import ChartContainer from '../ChartContainer.vue';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const dataStore = useDataStore();
const { filteredData, isLoading } = storeToRefs(dataStore);

const debouncedFilteredData = refDebounced(filteredData, 1000);

const oldData = ref<Record<number, number>>({});

const discovererStats = computed(() => {
  if (isLoading.value) return oldData.value;
  const discoveriesPerPlayer: Record<string, number> = {};

  // prettier-ignore
  for (let i = 0; i < debouncedFilteredData.value.length; i++) {  // NoSonar this is for performance
    const data = debouncedFilteredData.value[i];
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

watchEffect(() => {
  if (!isLoading.value) oldData.value = discovererStats.value;
});

const chartData = computed(() => ({
  labels: Object.keys(discovererStats.value),
  datasets: [
    {
      label: 'Players with Discovery Amount',
      backgroundColor: chartColours.blue,
      data: Object.values(discovererStats.value),
    },
  ],
}));
</script>

<template>
  <!--Average Discoveries-->
  <ChartContainer>
    <Bar
      :data="chartData"
      :options="chartOptions"
      class="chart"
    />
  </ChartContainer>
</template>
