<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import PaginationControls from '@/components/table/PaginationControls.vue';
import { appSections } from '@/variables/mappings';
import DetailsWrapper from '@/components/DetailsWrapper.vue';
import { getUTCDateString, getDatesBetween } from '@/helpers/date';
import { paginateData } from '@/helpers/paginate';
import { getRandomColour } from '@/helpers/colours';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const dataStore = useDataStore();
const { filteredData, dateRange, currentPageIndex, itemsPerPage } = storeToRefs(dataStore);

interface TimestampData {
  [key: string]: {
    [key: string]: number;
  };
}

interface PlayerData {
  name: string;
  colour: string;
}

const activeSection = computed(() => paginatedData.value[currentPageIndex.value.playerChart]);

const players = computed((): PlayerData[] => {
  const playerSet = new Set<string>();
  filteredData.value.forEach((item) => playerSet.add(item.Discoverer));
  const playerObj = Array.from(playerSet).map((player) => ({ name: player, colour: getRandomColour() }));

  return playerObj;
});

const blankData = computed(() => {
  const timestampData: TimestampData = {};

  const dates = getDatesBetween(...dateRange.value);
  if (dateRange.value[1]) dates.push(dateRange.value[1]);
  for (const date of dates) {
    const timestampObj: { [key: string]: number } = (timestampData[date] = {});
    for (const player of players.value) {
      timestampObj[player.name] = 0;
    }
  }
  return timestampData;
});

const transformedData = computed(() => {
  const discoveryAmount = structuredClone(blankData.value);
  for (const dataObj of filteredData.value) {
    if (!dataObj.Timestamp) continue;
    const utcDate = getUTCDateString(dataObj.Timestamp);
    discoveryAmount[utcDate][dataObj.Discoverer]++;
  }
  return discoveryAmount;
});

const paginatedData = computed(() => {
  const pages = paginateData(players.value, itemsPerPage.value.playerChart);

  if (pages.length < currentPageIndex.value.playerChart) currentPageIndex.value.playerChart = 0;
  return pages;
});

const individualDatasets = computed(() => {
  const datasets = [];
  for (const playerObj of activeSection.value) {
    const dataset = individualDatasetObjectFactory(playerObj);
    datasets.push(dataset);
  }
  return datasets;
});

const individualData = computed(() => {
  return {
    labels: Object.keys(blankData.value).map((ts) => new Date(ts).toLocaleDateString()),
    datasets: individualDatasets.value,
  };
});

const combinedDatasets = computed(() => {
  const datasets = [];
  for (const playerObj of activeSection.value) {
    const dataset = combinedDatasetObjectFactory(playerObj);
    datasets.push(dataset);
  }

  return datasets;
});

const combinedData = computed(() => {
  return {
    labels: Object.keys(blankData.value).map((ts) => new Date(ts).toLocaleDateString()),
    datasets: combinedDatasets.value,
  };
});

function combinedDatasetObjectFactory(playerObj: PlayerData): {
  label: string;
  backgroundColor: string;
  borderColor: string;
  data: (number | null)[];
} {
  const colour = playerObj.colour;

  const data = combineIndizes(playerObj.name);

  return {
    label: playerObj.name,
    backgroundColor: colour,
    borderColor: colour + '70',
    data,
  };
}

function individualDatasetObjectFactory(playerObj: PlayerData): {
  label: string;
  backgroundColor: string;
  borderColor: string;
  data: (number | null)[];
} {
  const colour = playerObj.colour;

  const data = Object.values(transformedData.value).map((item) => item[playerObj.name] || null);

  return {
    label: playerObj.name,
    backgroundColor: colour,
    borderColor: colour + '70',
    data,
  };
}

function combineIndizes(player: string): (number | null)[] {
  const timestampData = structuredClone(transformedData.value);
  const keys = Object.keys(timestampData);

  for (const [ts, players] of Object.entries(timestampData)) {
    const index = keys.indexOf(ts);

    for (const [player, amount] of Object.entries(players)) {
      const timestampDataObj = timestampData[keys[index + 1]];
      if (index + 1 === keys.length) continue;

      timestampDataObj[player] += amount;
    }
  }

  return Object.values(timestampData).map((item) => item[player] || null);
}

const options = {
  responsive: true,
  maintainAspectRatio: true,
};
</script>

<template>
  <DetailsWrapper summary="Players over time">
    <PaginationControls
      :total-pages="paginatedData.length"
      :section="appSections.playerChart"
    />
    <Line
      :data="individualData"
      :options="options"
    />
    <Line
      :data="combinedData"
      :options="options"
    />
  </DetailsWrapper>
</template>
