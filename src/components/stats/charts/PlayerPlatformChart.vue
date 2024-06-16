<script setup lang="ts">
import { Bar, Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { chartColours, platformMapping } from '@/variables/mappings';
import type { Platform } from '@/types/platform';
import type { ValueOf } from '@/types/utility';
import { setPlatformColours } from '@/helpers/colours';
import ChartWrapper from '@/components/ChartWrapper.vue';
import { chartOptions } from '@/variables/chart';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const dataStore = useDataStore();
const { filteredData } = storeToRefs(dataStore);

const platformStats = computed(
  (): {
    platforms: ValueOf<typeof platformMapping>[];
    players: number[];
  } => {
    const platformData = new Map<Platform, Set<string>>();

    for (const data of filteredData.value) {
      if (!platformData.has(data.Platform)) platformData.set(data.Platform, new Set<string>());
      platformData.get(data.Platform)?.add(data.Discoverer);
    }

    const platformDataArray = Array.from(platformData);

    const sortedPlatformDataArray = platformDataArray.toSorted((a, b) => b[1].size - a[1].size);

    platformData.clear();

    sortedPlatformDataArray.forEach(([key, val]) => platformData.set(key, val));

    return {
      platforms: Array.from(platformData.keys()).map((item) => platformMapping[item]),
      players: Array.from(platformData.values()).map((item) => item.size),
    };
  }
);

const barChartData = computed(() => ({
  labels: platformStats.value.platforms,
  datasets: [
    {
      backgroundColor: chartColours.blue,
      data: platformStats.value.players,
    },
  ],
}));

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
  <ChartWrapper
    group="chart"
    summary="Players per platform"
  >
    <Bar
      v-if="false"
      :data="barChartData"
      :options="chartOptions"
    />
    <div class="pie-chart q-mx-auto">
      <Pie
        :data="pieChartData"
        :options="chartOptions"
      />
    </div>
  </ChartWrapper>
</template>

<style scoped lang="scss">
.pie-chart {
  width: min(700px, 100%);
  margin-block-start: 2rem;
}
</style>
