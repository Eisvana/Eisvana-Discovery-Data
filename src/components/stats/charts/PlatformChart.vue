<script setup lang="ts">
import { Bar, Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { chartColours, platformMapping } from '@/variables/mappings';
import type { Platform } from '@/types/data';
import DetailsWrapper from '@/components/DetailsWrapper.vue';
import { setPlatformColours } from '@/helpers/colours';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

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
    if (data['Correctly Prefixed']) platformObject.tags++;
  }

  const sortedPlatformArray = Object.entries(platformData);

  sortedPlatformArray.sort((a, b) => b[1].discoveries - a[1].discoveries);

  const platformStatsObject = Object.fromEntries(sortedPlatformArray);

  return {
    platforms: Object.keys(platformStatsObject).map((item) => platformMapping[item as Platform]),
    tags: Object.values(platformStatsObject).map((item) => item.tags),
    incorrect: Object.values(platformStatsObject).map((item) => item.discoveries - item.tags),
  };
});

const barChartData = computed(() => ({
  labels: platformStats.value.platforms,
  datasets: [
    {
      label: 'Tagged',
      backgroundColor: chartColours.blue,
      data: platformStats.value.tags,
    },
    {
      label: 'Not Tagged',
      backgroundColor: chartColours.red,
      data: platformStats.value.incorrect,
    },
  ],
}));

const pieChartData = computed(() => {
  const discoveries: number[] = [];

  const colours = setPlatformColours(platformStats.value.platforms);

  for (let i = 0; i < platformStats.value.platforms.length; i++) {
    const numOfDiscoveries = platformStats.value.tags[i] + platformStats.value.incorrect[i];
    discoveries.push(numOfDiscoveries);
  }

  return {
    labels: platformStats.value.platforms,
    datasets: [
      {
        backgroundColor: colours,
        data: discoveries,
      },
    ],
  };
});

const barChartOptions = {
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

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
};
</script>

<template>
  <DetailsWrapper summary="Discoveries and prefixes per platform">
    <Bar
      :data="barChartData"
      :options="barChartOptions"
    />
    <div class="pie-chart">
      <Pie
        :data="pieChartData"
        :options="pieChartOptions"
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
