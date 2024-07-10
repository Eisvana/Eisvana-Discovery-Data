<script setup lang="ts">
import { categoryMapping, chartColours } from '@/variables/mappings';
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
import { getDatesBetween, getUTCDateString } from '@/helpers/date';
import { refDebounced } from '@vueuse/core';
import { debounceDelay } from '@/variables/debounce';
import { chartOptions } from '@/variables/chart';
import type { TimestampData, TimestampDataArray } from '@/types/data';
import { useFilterStore } from '@/stores/filter';
import type { ChartData } from '@/types/chart';
import LoadingOverlay from '../LoadingOverlay.vue';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const dataStore = useDataStore();
const { filteredData, dateRange, isLoading } = storeToRefs(dataStore);

const filterStore = useFilterStore();
const { sortedCategories } = storeToRefs(filterStore);

const debouncedFilteredData = refDebounced(filteredData, debounceDelay);
const debouncedDateRange = refDebounced(dateRange, debounceDelay);

const oldData = ref<TimestampDataArray[]>([]);

const transformedData = computed(() => {
  if (isLoading.value) return oldData.value;
  const timestampData: TimestampData = {};

  const dates = getDatesBetween(...debouncedDateRange.value);
  if (debouncedDateRange.value[1]) dates.push(debouncedDateRange.value[1]);
  for (const date of dates) {
    timestampData[date] = {
      discoveries: 0,
      tags: 0,
      mistags: 0,
    };
  }

  // prettier-ignore
  for (let i = 0; i < debouncedFilteredData.value.length; i++) {  // NoSonar this is for performance
    const item = debouncedFilteredData.value[i];
    if (!item.Timestamp) continue;

    const utcDate = getUTCDateString(item.Timestamp);
    const timestampObj = timestampData[utcDate];
    if (!timestampObj) break;
    timestampObj.discoveries++;
    if (item['Correctly Prefixed']) {
      timestampObj.tags++;
    } else {
      timestampObj.mistags++;
    }
    sortedCategories.value.forEach((cat) => (timestampObj[cat] ??= 0));
    const category = item.Category;
    if (timestampObj[category] !== undefined) timestampObj[category]++;
  }

  const newDateArray: TimestampDataArray[] = Object.entries(timestampData).map(([ts, data]) => ({ ts, ...data }));

  return newDateArray;
});

watchEffect(() => {
  if (!isLoading.value) oldData.value = transformedData.value;
});

const data = computed(() => {
  const datasets: ChartData[] = [
    {
      label: 'Total Discoveries',
      backgroundColor: chartColours.green,
      data: Object.values(transformedData.value).map((day) => day.discoveries || null),
    },
  ];

  if (sortedCategories.value.length > 1) {
    const mappedDatasets = sortedCategories.value.map((cat) => {
      const categoryDiscoveries = Object.values(transformedData.value).map((day) => day[cat] || null);
      const backgroundColor = categoryMapping[cat].colour;

      return {
        label: categoryMapping[cat].label,
        data: categoryDiscoveries,
        backgroundColor,
      };
    });
    datasets.push(...mappedDatasets);
  } else if (sortedCategories.value[0] === 'SolarSystem') {
    const tags = Object.values(transformedData.value).map((day) => day.tags || null);
    const mistags = Object.values(transformedData.value).map((day) => day.mistags || null);
    datasets.push(
      {
        label: 'Correct Tags',
        backgroundColor: chartColours.blue,
        data: tags,
      },
      {
        label: 'Incorrect Tags',
        backgroundColor: chartColours.red,
        data: mistags,
      }
    );
  }
  datasets.forEach((item) => (item.borderColor = item.backgroundColor + '70'));
  const labels = transformedData.value.map(({ ts }) => new Date(ts).toLocaleDateString());

  return {
    labels,
    datasets,
  };
});
</script>

<template>
  <!--Discoveries per Day-->
  <Line
    :data="data"
    :options="chartOptions"
    class="chart"
  />

  <LoadingOverlay v-if="isLoading" />
</template>
