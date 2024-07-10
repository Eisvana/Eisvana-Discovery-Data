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
import { computed, ref } from 'vue';
import { Line } from 'vue-chartjs';
import { getUTCDateString, getDatesBetween } from '@/helpers/date';
import { paginateData } from '@/helpers/paginate';
import { getRandomColour } from '@/helpers/colours';
import type { ChartData } from '@/types/chart';
import PaginationControls from '@/components/PaginationControls.vue';
import { refDebounced } from '@vueuse/core';
import { debounceDelay } from '@/variables/debounce';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const dataStore = useDataStore();
const { filteredData, dateRange, isLoading } = storeToRefs(dataStore);

const debouncedFilteredData = refDebounced(filteredData, debounceDelay);
const debouncedDateRange = refDebounced(dateRange, debounceDelay);

interface TimestampData {
  [key: string]: {
    [key: string]: number;
  };
}

interface PlayerData {
  name: string;
  colour: string;
}

const itemsPerPage = ref(10);
const currentPage = ref(1);
const currentPageIndex = computed(() => currentPage.value - 1);

const players = computed((): PlayerData[] => {
  const playerSet = new Set<string>();
  debouncedFilteredData.value.forEach((item) => playerSet.add(item.Discoverer));
  const playerObj = Array.from(playerSet).map((player) => ({ name: player, colour: getRandomColour() }));

  return playerObj;
});

const blankData = computed(() => {
  const timestampData: TimestampData = {};

  const dates = getDatesBetween(...debouncedDateRange.value);
  if (debouncedDateRange.value[1]) dates.push(debouncedDateRange.value[1]);
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
  // prettier-ignore
  for (let i = 0; i < debouncedFilteredData.value.length; i++) {  // NoSonar this is for performance
    const dataObj = debouncedFilteredData.value[i];
    if (!dataObj.Timestamp) continue;

    const utcDate = getUTCDateString(dataObj.Timestamp);
    discoveryAmount[utcDate][dataObj.Discoverer]++;
  }
  return discoveryAmount;
});

const paginatedData = computed(() => paginateData(players.value, itemsPerPage.value, currentPageIndex.value));

const individualDatasets = computed(() => paginatedData.value.map(individualDatasetObjectFactory));

const individualData = computed(() => ({
  labels: Object.keys(blankData.value).map((ts) => new Date(ts).toLocaleDateString()),
  datasets: individualDatasets.value,
}));

const combinedDatasets = computed(() => paginatedData.value.map(combinedDatasetObjectFactory));

const combinedData = computed(() => ({
  labels: Object.keys(blankData.value).map((ts) => new Date(ts).toLocaleDateString()),
  datasets: combinedDatasets.value,
}));

function combinedDatasetObjectFactory(playerObj: PlayerData): ChartData {
  const colour = playerObj.colour;

  const data = combineIndizes(playerObj.name);

  return {
    label: playerObj.name,
    backgroundColor: colour,
    borderColor: colour + '70',
    data,
  };
}

function individualDatasetObjectFactory(playerObj: PlayerData): ChartData {
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
  maintainAspectRatio: false,
};
</script>

<template>
  <!--Players over Time-->
  <PaginationControls
    v-model:current-page="currentPage"
    v-model:items-per-page="itemsPerPage"
    :data="players"
  />
  <div class="relative-position">
    <Line
      :data="individualData"
      :options="options"
      class="chart"
    />

    <QInnerLoading
      :showing="isLoading"
      label="Loading Data..."
    />
  </div>

  <div class="relative-position">
    <Line
      :data="combinedData"
      :options="options"
      class="chart"
    />

    <QInnerLoading
      :showing="isLoading"
      label="Loading Data..."
    />
  </div>
</template>
