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
import { getUTCDateString, getDatesBetween } from '@/helpers/date';
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
    timestampData[date] = {
      correct: 0,
      incorrect: 0,
    };
  }

  const keys = Object.keys(timestampData);

  for (const dataObj of debouncedFilteredData.value) {
    if (!dataObj.Timestamp) continue;
    const utcDate = getUTCDateString(dataObj.Timestamp);
    const index = keys.indexOf(utcDate);
    const isCorrect = dataObj['Correctly Prefixed'];

    for (let j = index; j < keys.length; j++) {
      const key = keys[j];
      timestampData[key][isCorrect ? 'correct' : 'incorrect']++;
    }
  }

  return timestampData;
});

const data = computed(() => ({
  labels: Object.keys(transformedData.value).map((ts) => new Date(ts).toLocaleDateString()),
  datasets: [
    {
      label: 'Total Discoveries',
      backgroundColor: chartColours.green,
      borderColor: chartColours.green + '70',
      data: Object.values(transformedData.value).map((num) => num.correct + num.incorrect || null),
    },
    {
      label: 'Correct Tags',
      backgroundColor: chartColours.blue,
      borderColor: chartColours.blue + '70',
      data: Object.values(transformedData.value).map((num) => num.correct || null),
    },
    {
      label: 'Incorrect Tags',
      backgroundColor: chartColours.red,
      borderColor: chartColours.red + '70',
      data: Object.values(transformedData.value).map((num) => num.incorrect || null),
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
