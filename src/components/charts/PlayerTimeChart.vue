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
import { computed, ref, watchEffect } from 'vue';
import { Line } from 'vue-chartjs';
import { getUTCDateString, getDatesBetween } from '@/helpers/date';
import { paginateData } from '@/helpers/paginate';
import { getRandomColour } from '@/helpers/colours';
import type { ChartData } from '@/types/chart';
import PaginationControls from '@/components/PaginationControls.vue';
import { refDebounced } from '@vueuse/core';
import { debounceDelay } from '@/variables/debounce';
import { chartOptions } from '@/variables/chart';
import LoadingOverlay from '../LoadingOverlay.vue';
import type { PlayerDiscoveryNumbers, PlayerPaginationData, TimeTrackingCategories } from '@/types/data';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const dataStore = useDataStore();
const { filteredData, dateRange, isLoading } = storeToRefs(dataStore);

const debouncedFilteredData = refDebounced(filteredData, debounceDelay);
const debouncedDateRange = refDebounced(dateRange, debounceDelay);

const itemsPerPage = ref(10); // NoSonar this is one of the three possible rowsPerPage options
const currentPage = ref(1);
const currentPageIndex = computed(() => currentPage.value - 1);

function getUniqueRandomColour(trackingArray: string[]) {
  const colour = getRandomColour();
  if (trackingArray.includes(colour)) return getUniqueRandomColour(trackingArray);
  trackingArray.push(colour);
  return colour;
}

const oldPlayerData = ref<PlayerPaginationData[]>([]);
const oldDateData = ref<PlayerDiscoveryNumbers>({});

const playerData = computed(() => {
  if (isLoading.value) return oldPlayerData.value;
  const playerTracker: Record<string, { colour: string; discoveries: number }> = {};
  const colourTracker: string[] = [];
  debouncedFilteredData.value.forEach((item) => {
    const discoverer = item.Discoverer;
    const discovererObject = (playerTracker[discoverer] ??= {
      colour: getUniqueRandomColour(colourTracker),
      discoveries: 0,
    });
    discovererObject.discoveries++;
  });

  const playerObjects: PlayerPaginationData[] = Object.entries(playerTracker).map(([name, data]) => ({
    name,
    ...data,
  }));
  const sortedPlayerObjects = playerObjects.toSorted((a, b) => b.discoveries - a.discoveries);
  return sortedPlayerObjects;
});

const paginatedPlayerData = computed(() => paginateData(playerData.value, itemsPerPage.value, currentPageIndex.value));

const transformedData = computed(() => {
  if (isLoading.value) return oldDateData.value;
  const timestampData: PlayerDiscoveryNumbers = {};

  const dates = getDatesBetween(...debouncedDateRange.value);
  if (debouncedDateRange.value[1]) dates.push(debouncedDateRange.value[1]);

  // prettier-ignore
  for (let i = 0; i < dates.length; i++) {  // NoSonar this is for performance
    const date = dates[i];
    timestampData[date] = {};
    paginatedPlayerData.value.forEach((player) => {
      const { name, colour } = player;
      timestampData[date][name] = { colour, individual: 0, accumulated: 0 };
    });
  }

  const timestamps = Object.keys(timestampData);

  // prettier-ignore
  for (let i = 0; i < debouncedFilteredData.value.length; i++) {  // NoSonar this is for performance
    const dataObj = debouncedFilteredData.value[i];
    if (!dataObj.Timestamp) continue;

    const utcDate = getUTCDateString(dataObj.Timestamp);
    const timestampObj = timestampData[utcDate];
    if (!timestampObj) break;

    const discoverer = dataObj.Discoverer;
    const discovererObj = timestampObj[discoverer];
    if (!discovererObj) continue;

    discovererObj.individual++;

    const index = timestamps.indexOf(utcDate);

    // incrementing counter for future days
    for (let j = index; j < timestamps.length; j++) {
      const key = timestamps[j];
      const dayObj = timestampData[key];
      const discovererDayObj = dayObj[discoverer];
      discovererDayObj.accumulated++;
    }
  }
  return timestampData;
});

watchEffect(() => {
  if (!isLoading.value) {
    oldPlayerData.value = playerData.value;
    oldDateData.value = transformedData.value;
  }
});

const dateLabels = computed(() => Object.keys(transformedData.value).map((ts) => new Date(ts).toLocaleDateString()));

function buildChartData(playerObj: PlayerPaginationData, property: TimeTrackingCategories): ChartData {
  const { name, colour } = playerObj;
  const playerDataArray = Object.values(transformedData.value).map((item) => item[name][property] || null);

  return { label: name, backgroundColor: colour, borderColor: colour + '70', data: playerDataArray };
}

const data = computed(() => {
  const individualDatasets: ChartData[] = paginatedPlayerData.value.map((player) =>
    buildChartData(player, 'individual')
  );
  const accumulatedDatasets: ChartData[] = paginatedPlayerData.value.map((player) =>
    buildChartData(player, 'accumulated')
  );

  return [
    {
      labels: dateLabels.value,
      datasets: individualDatasets,
    },
    {
      labels: dateLabels.value,
      datasets: accumulatedDatasets,
    },
  ];
});
</script>

<template>
  <!--Players over Time-->
  <PaginationControls
    v-model:current-page="currentPage"
    v-model:items-per-page="itemsPerPage"
    :data="playerData"
  />
  <div
    v-for="chartData in data"
    class="relative-position"
  >
    <Line
      :data="chartData"
      :options="chartOptions"
      class="chart"
    />

    <LoadingOverlay v-if="isLoading" />
  </div>
</template>
