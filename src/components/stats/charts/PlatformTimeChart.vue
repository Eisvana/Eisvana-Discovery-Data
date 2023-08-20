<script setup lang="ts">
import { getDatesBetween, setPlatformColours } from '@/logic/logic';
import { PlatformMapping } from '@/objects/mappings';
import { useDataStore } from '@/stores/data';
import type { Platform } from '@/types/data';
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
    ST: number;
    PS: number;
    XB: number;
    GX: number;
    NI: number;
  };
}

const blankData = computed(() => {
  const timestampData: TimestampData = {};

  const dates = getDatesBetween(...dateRange.value);
  if (dateRange.value[1]) dates.push(dateRange.value[1]);
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

const getPlatformColour = (platform: Platform) => setPlatformColours([PlatformMapping[platform]])[0];

const transformedData = computed(() => {
  const discoveryAmount = structuredClone(blankData.value);
  for (const dataObj of filteredData.value) {
    if (!dataObj.Timestamp) continue;
    discoveryAmount[dataObj.Timestamp][dataObj.Platform]++;
  }
  return discoveryAmount;
});

function combineIndizes(platform: Platform): (number | null)[] {
  const timestampData = structuredClone(transformedData.value);
  const keys = Object.keys(timestampData);

  for (const [ts, platformValues] of Object.entries(timestampData)) {
    const index = keys.indexOf(ts);

    for (const [platform, amount] of Object.entries(platformValues)) {
      const timestampDataObj = timestampData[keys[index + 1]];
      if (index + 1 === keys.length) continue;

      timestampDataObj[platform as Platform] += amount;
    }
  }

  return Object.values(timestampData).map((item) => item[platform] || null);
}

function individualDatasetObjectFactory(platform: Platform): {
  label: string;
  backgroundColor: string;
  borderColor: string;
  data: (number | null)[];
} {
  const colour = getPlatformColour(platform);

  const data = Object.values(transformedData.value).map((item) => item[platform] || null);

  return {
    label: PlatformMapping[platform],
    backgroundColor: colour,
    borderColor: colour + '70',
    data,
  };
}

function combinedDatasetObjectFactory(platform: Platform): {
  label: string;
  backgroundColor: string;
  borderColor: string;
  data: (number | null)[];
} {
  const colour = getPlatformColour(platform);

  const data = combineIndizes(platform);

  return {
    label: PlatformMapping[platform],
    backgroundColor: colour,
    borderColor: colour + '70',
    data,
  };
}

const individualDatasets = computed(() => {
  const datasets = [];
  for (const platform of Object.keys(PlatformMapping)) {
    const dataset = individualDatasetObjectFactory(platform as keyof typeof PlatformMapping);
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
  for (const platform of Object.keys(PlatformMapping)) {
    const dataset = combinedDatasetObjectFactory(platform as keyof typeof PlatformMapping);
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

const options = {
  responsive: true,
  maintainAspectRatio: true,
};
</script>

<template>
  <DetailsWrapper summary="Platforms over time">
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
