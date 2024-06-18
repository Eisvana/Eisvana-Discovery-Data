<script setup lang="ts">
import { platformMapping } from '@/variables/mappings';
import { useDataStore } from '@/stores/data';
import type { Platform } from '@/types/platform';
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
import { getUTCDateString, getDatesBetween } from '@/helpers/date';
import { setPlatformColours } from '@/helpers/colours';
import { isPlatformCode } from '@/helpers/typeGuards';
import type { ChartData } from '@/types/chart';
import { refDebounced } from '@vueuse/core';
import { debounceDelay } from '@/variables/debounce';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const dataStore = useDataStore();
const { filteredData, dateRange } = storeToRefs(dataStore);

const debouncedFilteredData = refDebounced(filteredData, debounceDelay);
const debouncedDateRange = refDebounced(dateRange, debounceDelay);

interface TimestampData {
  [key: string]: {
    ST: number;
    PS: number;
    XB: number;
    GX: number;
    NI: number;
  };
}

const blankData = computed(() => {
  const timestampData: TimestampData = {};

  const dates = getDatesBetween(...debouncedDateRange.value);
  if (debouncedDateRange.value[1]) dates.push(debouncedDateRange.value[1]);
  for (const date of dates) {
    timestampData[date] = {
      ST: 0,
      PS: 0,
      XB: 0,
      GX: 0,
      NI: 0,
    };
  }
  return timestampData;
});

const getPlatformColour = (platform: Platform) => setPlatformColours([platformMapping[platform]])[0];

const transformedData = computed(() => {
  const discoveryAmount = structuredClone(blankData.value);
  for (const dataObj of debouncedFilteredData.value) {
    if (!dataObj.Timestamp) continue;
    const utcDate = getUTCDateString(dataObj.Timestamp);
    discoveryAmount[utcDate][dataObj.Platform]++;
  }
  return discoveryAmount;
});

function combineIndizes(platform: Platform): (number | null)[] {
  const timestampData = structuredClone(transformedData.value);
  const keys = Object.keys(timestampData);

  Object.entries(timestampData).forEach(([_, platformValues], index) => {
    Object.entries(platformValues).forEach(([platform, amount]) => {
      const timestampDataObj = timestampData[keys[index + 1]];
      if (index + 1 === keys.length) return;

      if (!isPlatformCode(platform)) return;
      timestampDataObj[platform] += amount;
    });
  });

  return Object.values(timestampData).map((item) => item[platform] || null);
}

function individualDatasetObjectFactory(platform: Platform): ChartData {
  const colour = getPlatformColour(platform);

  const data = Object.values(transformedData.value).map((item) => item[platform] || null);

  return {
    label: platformMapping[platform],
    backgroundColor: colour,
    borderColor: colour + '70',
    data,
  };
}

function combinedDatasetObjectFactory(platform: Platform): ChartData {
  const colour = getPlatformColour(platform);

  const data = combineIndizes(platform);

  return {
    label: platformMapping[platform],
    backgroundColor: colour,
    borderColor: colour + '70',
    data,
  };
}

const individualDatasets = computed(() => {
  const datasets = [];
  for (const platform of Object.keys(platformMapping)) {
    if (!isPlatformCode(platform)) continue;
    const dataset = individualDatasetObjectFactory(platform);
    datasets.push(dataset);
  }
  return datasets;
});

const individualData = computed(() => ({
  labels: Object.keys(blankData.value).map((ts) => new Date(ts).toLocaleDateString()),
  datasets: individualDatasets.value,
}));

const combinedDatasets = computed(() => {
  const datasets = [];
  for (const platform of Object.keys(platformMapping)) {
    if (!isPlatformCode(platform)) continue;
    const dataset = combinedDatasetObjectFactory(platform);
    datasets.push(dataset);
  }
  return datasets;
});

const combinedData = computed(() => ({
  labels: Object.keys(blankData.value).map((ts) => new Date(ts).toLocaleDateString()),
  datasets: combinedDatasets.value,
}));

const options = {
  responsive: true,
  maintainAspectRatio: true,
};
</script>

<template>
  <Line
    :data="individualData"
    :options="options"
    class="chart"
  />
  <Line
    :data="combinedData"
    :options="options"
    class="chart"
  />
</template>
