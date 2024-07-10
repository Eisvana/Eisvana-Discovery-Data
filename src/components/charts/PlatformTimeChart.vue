<script setup lang="ts">
import { platformMapping } from '@/variables/mappings';
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
import type { ChartData } from '@/types/chart';
import { refDebounced } from '@vueuse/core';
import { debounceDelay } from '@/variables/debounce';
import { chartOptions } from '@/variables/chart';
import type { TimestampPlatformData, TimeTrackingCategories } from '@/types/data';
import { useFilterStore } from '@/stores/filter';
import type { Platform } from '@/types/platform';
import ChartContainer from '../ChartContainer.vue';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const dataStore = useDataStore();
const { filteredData, dateRange, isLoading } = storeToRefs(dataStore);

const filterStore = useFilterStore();
const { sortedPlatforms } = storeToRefs(filterStore);

const debouncedFilteredData = refDebounced(filteredData, debounceDelay);
const debouncedDateRange = refDebounced(dateRange, debounceDelay);

const oldData = ref<TimestampPlatformData>({});

const transformedData = computed(() => {
  if (isLoading.value) return oldData.value;
  const timestampData: TimestampPlatformData = {};

  const dates = getDatesBetween(...debouncedDateRange.value);
  if (debouncedDateRange.value[1]) dates.push(debouncedDateRange.value[1]);

  // prettier-ignore
  for (let i = 0; i < dates.length; i++) {	// NoSonar this is for performance
    const date = dates[i];
    timestampData[date] = {
      individual: {},
      accumulated: {},
    };
  }

  const timestamps = Object.keys(timestampData);

  // prettier-ignore
  for (let i = 0; i < debouncedFilteredData.value.length; i++) {  // NoSonar this is for performance
    const dataObj = debouncedFilteredData.value[i];
    if (!dataObj.Timestamp) continue;

    const utcDate = getUTCDateString(dataObj.Timestamp);
    const timestampObj = timestampData[utcDate];
    if (!timestampObj) break;

    // adding counters if they don't exist yet
    sortedPlatforms.value.forEach((platform) => (timestampObj.individual[platform] ??= 0));

    // incrementing counter for current day
    const platform = dataObj.Platform;
    if (timestampObj.individual[platform] !== undefined) timestampObj.individual[platform]++;

    const index = timestamps.indexOf(utcDate);

    // incrementing counter for future days
    for (let j = index; j < timestamps.length; j++) {
      const key = timestamps[j];
      const dayObj = timestampData[key];
      sortedPlatforms.value.forEach((platform) => (dayObj.accumulated[platform] ??= 0));
      if (dayObj.accumulated[platform] !== undefined) dayObj.accumulated[platform]++;
    }
  }
  return timestampData;
});

watchEffect(() => {
  if (!isLoading.value) oldData.value = transformedData.value;
});

const dateLabels = computed(() => Object.keys(transformedData.value).map((ts) => new Date(ts).toLocaleDateString()));

function buildChartData(platform: Platform, property: TimeTrackingCategories): ChartData {
  const label = platformMapping[platform].label;
  const colour = platformMapping[platform].colour;
  const data = Object.values(transformedData.value).map((day) => day[property][platform] || null);
  return { label, data, backgroundColor: colour, borderColor: colour + '70' };
}

const data = computed(() => {
  const individualDatasets: ChartData[] = sortedPlatforms.value.map((platform) =>
    buildChartData(platform, 'individual')
  );
  const accumulatedDatasets: ChartData[] = sortedPlatforms.value.map((platform) =>
    buildChartData(platform, 'accumulated')
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
  <!--Platforms over Time-->
  <ChartContainer v-for="chartData in data">
    <Line
      :data="chartData"
      :options="chartOptions"
      class="chart"
    />
  </ChartContainer>
</template>
