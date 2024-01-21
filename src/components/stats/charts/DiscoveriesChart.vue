<script setup lang="ts">
import { getDatesBetween } from '@/logic/logic';
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
import DetailsWrapper from '@/components/DetailsWrapper.vue';

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
    timestampData[date] = {
      correct: 0,
      incorrect: 0,
    };
  }

  const keys = Object.keys(timestampData);

  for (const dataObj of filteredData.value) {
    if (!dataObj.Timestamp) continue;
    const index = keys.indexOf(dataObj.Timestamp);
    const isCorrect = dataObj['Correctly Prefixed'];

    for (let j = index; j < keys.length; j++) {
      const key = keys[j];
      timestampData[key][isCorrect ? 'correct' : 'incorrect']++;
    }
  }

  return timestampData;
});

const data = computed(() => {
  return {
    labels: Object.keys(transformedData.value).map((ts) => new Date(ts).toLocaleDateString()),
    datasets: [
      {
        label: 'Total Discoveries',
        backgroundColor: ChartColours.green,
        borderColor: ChartColours.green + '70',
        data: Object.values(transformedData.value).map((num) => num.correct + num.incorrect || null),
      },
      {
        label: 'Correct Tags',
        backgroundColor: ChartColours.blue,
        borderColor: ChartColours.blue + '70',
        data: Object.values(transformedData.value).map((num) => num.correct || null),
      },
      {
        label: 'Incorrect Tags',
        backgroundColor: ChartColours.red,
        borderColor: ChartColours.red + '70',
        data: Object.values(transformedData.value).map((num) => num.incorrect || null),
      },
    ],
  };
});

const options = {
  responsive: true,
  maintainAspectRatio: true,
};
</script>

<template>
  <DetailsWrapper summary="Discoveries over time">
    <Line
      :data="data"
      :options="options"
    />
  </DetailsWrapper>
</template>
