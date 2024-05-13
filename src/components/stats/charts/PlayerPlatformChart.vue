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
import DetailsWrapper from '@/components/DetailsWrapper.vue';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const dataStore = useDataStore();
const { filteredData } = storeToRefs(dataStore);

const platformStats = computed(
  (): {
    platforms: ValueOf<typeof platformMapping>[];
    players: number[];
  } => {
    const platformData: { [key: string]: Set<string> } = {};

    for (const data of filteredData.value) {
      platformData[data.Platform] ??= new Set<string>();
      platformData[data.Platform].add(data.Discoverer);
    }

    const platformDataArray = Object.entries(platformData);

    platformDataArray.sort((a, b) => b[1].size - a[1].size);

    return {
      platforms: platformDataArray.map((item) => platformMapping[item[0] as Platform]),
      players: platformDataArray.map((item) => item[1].size),
    };
  }
);

const barChartData = computed(() => {
  return {
    labels: platformStats.value.platforms,
    datasets: [
      {
        backgroundColor: chartColours.blue,
        data: platformStats.value.players,
      },
    ],
  };
});

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

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
};
</script>

<template>
  <DetailsWrapper summary="Players per platform">
    <Bar
      v-if="false"
      :data="barChartData"
      :options="chartOptions"
    />
    <div class="pie-chart">
      <Pie
        :data="pieChartData"
        :options="chartOptions"
      />
    </div>
  </DetailsWrapper>
</template>

<style scoped lang="scss">
.pie-chart {
  width: min(700px, 100%);
  margin-inline: auto;
  margin-block-start: 2rem;
}
</style>
