<script setup lang="ts">
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { platformMapping } from '@/variables/mappings';
import type { Platform } from '@/types/platform';
import { setPlatformColours } from '@/helpers/colours';
import { chartOptions } from '@/variables/chart';
import { refDebounced } from '@vueuse/core';
import { debounceDelay } from '@/variables/debounce';
import PieChartWrapper from '../../PieChartWrapper.vue';
import type { PlatformLabels } from '@/types/data';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const dataStore = useDataStore();
const { filteredData, isLoading } = storeToRefs(dataStore);

const debouncedFilteredData = refDebounced(filteredData, debounceDelay);

const platformStats = computed(
  (): {
    platforms: PlatformLabels[];
    players: number[];
  } => {
    const platformData = new Map<Platform, Set<string>>();

    // prettier-ignore
    for (let i = 0; i < debouncedFilteredData.value.length; i++) {  // NoSonar this is for performance
    const data = debouncedFilteredData.value[i];
      if (!platformData.has(data.Platform)) platformData.set(data.Platform, new Set<string>());
      platformData.get(data.Platform)?.add(data.Discoverer);
    }

    const platformDataArray = Array.from(platformData);

    const sortedPlatformDataArray = platformDataArray.toSorted((a, b) => b[1].size - a[1].size);

    platformData.clear();

    sortedPlatformDataArray.forEach(([key, val]) => platformData.set(key, val));

    return {
      platforms: Array.from(platformData.keys()).map((item) => platformMapping[item].label),
      players: Array.from(platformData.values()).map((item) => item.size),
    };
  }
);

const pieChartData = computed(() => {
  const colours = setPlatformColours(platformStats.value.platforms);

  return {
    labels: platformStats.value.platforms,
    datasets: [
      {
        backgroundColor: colours,
        data: platformStats.value.players,
      },
    ],
  };
});
</script>

<template>
  <!--Players per platform-->
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
