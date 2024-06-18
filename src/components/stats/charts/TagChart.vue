<script setup lang="ts">
import { chartColours } from '@/variables/mappings';
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
import { getDatesBetween, getUTCDateString } from '@/helpers/date';
import { refDebounced } from '@vueuse/core';
import { debounceDelay } from '@/variables/debounce';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const dataStore = useDataStore();
const { filteredData, dateRange } = storeToRefs(dataStore);

const debouncedFilteredData = refDebounced(filteredData, debounceDelay);
const debouncedDateRange = refDebounced(dateRange, debounceDelay);

interface TimestampData {
  [key: string]: {
    correct: number;
    incorrect: number;
  };
}

const transformedData = computed(() => {
  const timestampData: TimestampData = {};

  const dates = getDatesBetween(...debouncedDateRange.value);
  if (debouncedDateRange.value[1]) dates.push(debouncedDateRange.value[1]);
  for (const date of dates) {
    timestampData[date] = { correct: 0, incorrect: 0 };
  }

  // prettier-ignore
  for (let i = 0; i < debouncedFilteredData.value.length; i++) {  // NoSonar this is for performance
    const item = debouncedFilteredData.value[i];
    if (!item.Timestamp) continue;

    const utcDate = getUTCDateString(item.Timestamp);
    timestampData[utcDate][item['Correctly Prefixed'] ? 'correct' : 'incorrect']++;
  }

  const newDateArray: { ts: string; correct: number; incorrect: number }[] = Object.entries(timestampData).map(
    ([ts, data]) => ({ ts, ...data })
  );

  return newDateArray;
});

const data = computed(() => ({
  labels: transformedData.value.map((obj) => new Date(obj.ts).toLocaleDateString()),
  datasets: [
    {
      label: 'Total Discoveries',
      backgroundColor: chartColours.green,
      borderColor: chartColours.green + '70',
      data: transformedData.value.map((obj) => obj.correct + obj.incorrect || null),
    },
    {
      label: 'Correct Tags',
      backgroundColor: chartColours.blue,
      borderColor: chartColours.blue + '70',
      data: transformedData.value.map((obj) => obj.correct || null),
    },
    {
      label: 'Incorrect Tags',
      backgroundColor: chartColours.red,
      borderColor: chartColours.red + '70',
      data: transformedData.value.map((obj) => obj.incorrect || null),
    },
  ],
}));

const options = {
  responsive: true,
  maintainAspectRatio: true,
};
</script>

<template>
  <Line
    :data="data"
    :options="options"
    class="chart"
  />
</template>
