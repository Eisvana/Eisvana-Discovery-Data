<script setup lang="ts">
import { Bar, Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { chartColours } from '@/variables/mappings';
import type { DiscovererData, DiscovererDataArray } from '@/types/data';
import ChartWrapper from '@/components/ChartWrapper.vue';
import { paginateData } from '@/helpers/paginate';
import { getRandomColour } from '@/helpers/colours';
import PaginationControls from '@/components/PaginationControls.vue';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const dataStore = useDataStore();
const { filteredData } = storeToRefs(dataStore);

const itemsPerPage = ref(50); // NoSonar this is one of the three possible itemsPerRow options
const currentPage = ref(1);
const currentPageIndex = computed(() => currentPage.value - 1);

const discovererStats = computed(() => {
  const discovererData: DiscovererData = {};

  for (const data of filteredData.value) {
    if (!data.Discoverer) continue;
    const discovererObject = (discovererData[data.Discoverer] ??= {
      discoveries: 0,
      tags: 0,
    });
    discovererObject.discoveries++;
    if (data['Correctly Prefixed']) discovererObject.tags++;
  }

  const sortedDiscovererArray = Object.entries(discovererData).toSorted((a, b) => b[1].discoveries - a[1].discoveries);

  const discovererStatsObject: DiscovererDataArray[] = sortedDiscovererArray.map(([name, playerStats]) => ({
    name,
    ...playerStats,
  }));

  return discovererStatsObject;
});

const paginatedData = computed(() => paginateData(discovererStats.value, itemsPerPage.value, currentPageIndex.value));

const pieChartData = computed(() => {
  const playerNames: string[] = discovererStats.value.map((item) => item.name);
  const playerDiscoveries: number[] = discovererStats.value.map((item) => item.discoveries);
  const colours: string[] = discovererStats.value.map(getRandomColour);

  return {
    labels: playerNames,
    datasets: [
      {
        backgroundColor: colours,
        data: playerDiscoveries,
      },
    ],
  };
});

const barChartData = computed(() => {
  const playerNames: string[] = paginatedData.value.map((item) => item.name);
  const playerTags: number[] = paginatedData.value.map((item) => item.tags);
  const playerMistags: number[] = paginatedData.value.map((item) => item.discoveries - item.tags);

  return {
    labels: playerNames,
    datasets: [
      {
        label: 'Tagged',
        backgroundColor: chartColours.blue,
        data: playerTags,
      },
      {
        label: 'Not Tagged',
        backgroundColor: chartColours.red,
        data: playerMistags,
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
  <ChartWrapper summary="Discoveries and prefixes per player">
    <PaginationControls
      v-model:currentPage="currentPage"
      v-model:itemsPerPage="itemsPerPage"
      :data="discovererStats"
    />

    <Bar
      :data="barChartData"
      :options="barChartOptions"
      class="chart"
    />
    <Pie
      v-if="false"
      :data="pieChartData"
      :options="pieChartOptions"
    />
  </ChartWrapper>
</template>
