<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { AppSections, ChartColours } from '@/objects/mappings';
import PaginationControls from '@/components/table/PaginationControls.vue';
import { paginateData } from '@/logic/logic';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const dataStore = useDataStore();
const { filteredData, currentPageIndex, itemsPerPage } = storeToRefs(dataStore);

interface DiscovererData {
  [key: string]: {
    discoveries: number;
    tags: number;
  };
}

interface DiscovererDataArray {
  name: string;
  discoveries: number;
  tags: number;
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

const chartData = computed(() => {
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
    name: 'Test',
    datasets: [
      {
        label: 'Tagged',
        backgroundColor: ChartColours.blue,
        data: playerTags,
      },
      {
        label: 'Not Tagged',
        backgroundColor: ChartColours.red,
        data: playerMistags,
      },
    ],
  };
});

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
    <summary>Discoveries and Hub tags per player</summary>
    <PaginationControls
      :total-pages="paginatedData.length"
      :section="AppSections.discovererChart"
    />
    <Bar
      :data="chartData"
      :options="options"
    />
  </details>
</template>
