<script setup lang="ts">
import { ChartColours } from '@/objects/mappings';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const dataStore = useDataStore();
const { filteredData, dateRange } = storeToRefs(dataStore);

interface TimestampData {
  [key: string]: {
    correct: number;
    incorrect: number;
  };
}

const transformedData = computed(() => {
  const timestampData: TimestampData = {};

  const dates = getDatesBetween(...dateRange.value);
  if (dateRange.value[1]) dates.push(dateRange.value[1]);
  for (const date of dates) {
    timestampData[date] = { correct: 0, incorrect: 0 };
  }

  for (const item of filteredData.value) {
    timestampData[item.Timestamp][item['Correctly Tagged'] ? 'correct' : 'incorrect']++;
  }

  const newDateArray: { ts: string; correct: number; incorrect: number }[] = [];

  for (const [ts, data] of Object.entries(timestampData)) {
    newDateArray.push({
      ts,
      ...data,
    });
  }

  return newDateArray;
});

const data = computed(() => {
  return {
    labels: transformedData.value.map((obj) => new Date(obj.ts).toLocaleDateString()),
    datasets: [
      {
        label: 'Correct Tags',
        backgroundColor: ChartColours.blue,
        borderColor: ChartColours.blue + '70',
        data: transformedData.value.map((obj) => obj.correct || null),
      },
      {
        label: 'Incorrect Tags',
        backgroundColor: ChartColours.red,
        borderColor: ChartColours.red + '70',
        data: transformedData.value.map((obj) => obj.incorrect || null),
      },
    ],
  };
});

const options = {
  responsive: true,
  maintainAspectRatio: true,
  // scales: {
  //   x: {
  //     type: 'time',
  //   },
  // },
};

function getDatesBetween(startDate: string, endDate: string) {
  if (!startDate || !endDate) return [];
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  const dates = [];
  const currentDate = new Date(startDateObj);
  while (currentDate <= endDateObj) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates.map((date) => date.toISOString().split('T')[0]);
}
</script>

<template>
  <details>
    <summary>Hub Tags over time</summary>
    <Line
      :data="data"
      :options="options"
    />
  </details>
</template>
