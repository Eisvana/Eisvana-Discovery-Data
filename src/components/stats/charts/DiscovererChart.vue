<script setup lang="ts">
import { Bar, Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { appSections, chartColours } from '@/variables/mappings';
import PaginationControls from '@/components/table/PaginationControls.vue';
import type { DiscovererData, DiscovererDataArray } from '@/types/data';
import DetailsWrapper from '@/components/DetailsWrapper.vue';
import { paginateData } from '@/helpers/paginate';
import { getRandomColour } from '@/helpers/colours';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const dataStore = useDataStore();
const { filteredData, currentPageIndex, itemsPerPage } = storeToRefs(dataStore);

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

  const sortedDiscovererArray = Object.entries(discovererData);

  sortedDiscovererArray.sort((a, b) => b[1].discoveries - a[1].discoveries);

  const discovererStatsObject: DiscovererDataArray[] = [];

  for (const [name, playerStats] of sortedDiscovererArray) {
    discovererStatsObject.push({ name, ...playerStats });
  }

  return discovererStatsObject;
});

const paginatedData = computed(() => {
  const pages = paginateData(discovererStats.value, itemsPerPage.value.discovererChart);

  if (pages.length < currentPageIndex.value.discovererChart) currentPageIndex.value.discovererChart = 0;
  return pages;
});

const pieChartData = computed(() => {
  const data = discovererStats.value;

  const playerNames: string[] = [];
  const playerDiscoveries: number[] = [];
  const colours: string[] = [];

  for (const obj of data) {
    playerNames.push(obj.name);
    playerDiscoveries.push(obj.discoveries);
    colours.push(getRandomColour());
  }

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
  const data = paginatedData.value[currentPageIndex.value.discovererChart] as DiscovererDataArray[];

  const playerNames: string[] = [];
  const playerTags: number[] = [];
  const playerMistags: number[] = [];

  for (const obj of data) {
    playerNames.push(obj.name);
    playerTags.push(obj.tags);
    playerMistags.push(obj.discoveries - obj.tags);
  }

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
  <DetailsWrapper summary="Discoveries and prefixes per player">
    <PaginationControls
      :total-pages="paginatedData.length"
      :section="appSections.discovererChart"
    />
    <Bar
      :data="barChartData"
      :options="barChartOptions"
    />
    <Pie
      v-if="false"
      :data="pieChartData"
      :options="pieChartOptions"
    />
  </DetailsWrapper>
</template>
