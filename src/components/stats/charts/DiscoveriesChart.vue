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
import { computed, ref, watch } from 'vue';
import { Line } from 'vue-chartjs';
import { getUTCDateString, getDatesBetween } from '@/helpers/date';
import { refDebounced } from '@vueuse/core';
import { debounceDelay } from '@/variables/debounce';
import type { DiscoveryCategories } from '@/types/data';
import type { ChartData } from '@/types/chart';
import { useFilterStore } from '@/stores/filter';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const dataStore = useDataStore();
const { filteredData, dateRange, isLoading } = storeToRefs(dataStore);

const filterStore = useFilterStore();
const { sortedCategories } = storeToRefs(filterStore);

const debouncedFilteredData = refDebounced(filteredData, debounceDelay);
const debouncedDateRange = refDebounced(dateRange, debounceDelay);
const debouncedSortedCategories = refDebounced(sortedCategories, debounceDelay);

interface TimestampData {
  [key: string]: Partial<Record<DiscoveryCategories, number>> & {
    correct: number;
    incorrect: number;
    discoveries: number;
  };
}

const oldData = ref<TimestampData>({});

const transformedData = computed(() => {
  if (isLoading.value) return oldData.value;
  const timestampData: TimestampData = {};
  const dates = getDatesBetween(...debouncedDateRange.value);
  // the getDatesBetween() function does not include the last day, so we are manually adding it here if it exists
  if (debouncedDateRange.value[1]) dates.push(debouncedDateRange.value[1]);

  // prettier-ignore
  for (let i = 0; i < dates.length; i++) {	// NoSonar this is for performance
    const date = dates[i];
    timestampData[date] = {
      correct: 0,
      incorrect: 0,
      discoveries: 0
    };
  }

  const keys = Object.keys(timestampData);

  // prettier-ignore
  for (let i = 0; i < debouncedFilteredData.value.length; i++) {  // NoSonar this is for performance
    const dataObj = debouncedFilteredData.value[i];
    if (!dataObj.Timestamp) continue;

    const utcDate = getUTCDateString(dataObj.Timestamp);

    /*
    I have a story to tell again, about a stupid error.
    You see that we're doing a lot of debouncing to improve performance.
    However, all of this debouncing introduces issues with data mismatches.
    For example, filteredData updates very often, therefore the debounced variable is only updated rarely in the component.
    The dateRange variable does not update often, therefore it is updated more often in the component.
    So if debouncedDateRange updates before debouncedFilteredData, this creates issues if there is an entry in the filteredData that has a timestamp outside of dateRange.
    This is easily reproducible by having only "Planets" selected, then adding "Systems" to that.
    Since one system is discovered on 25th September 2023, but the first planet was discovered on 26 September 2023, the system freaks out because it cannot be listed in the graph.
    In this case we have to detect this mismatch and have to throw the whole calculation away, since now it's worthless.
    A future re-render will re-run this computation with the proper values, so this is only a temporary error state.
    And that's the reason why we check for a bad index and then break the loop here...
    */
    const index = keys.indexOf(utcDate);
    if (index === -1) break;
    const isCorrect = dataObj['Correctly Prefixed'];

    const category = dataObj.Category;

    for (let j = index; j < keys.length; j++) {
      const key = keys[j];
      const dayObj = timestampData[key];
      dayObj.discoveries++;
      dayObj[isCorrect ? 'correct' : 'incorrect']++;
      debouncedSortedCategories.value.forEach((cat) => (dayObj[cat] ??= 0));
      if (dayObj[category] !== undefined) dayObj[category]++;
    }
  }
  return timestampData;
});

watch(
  isLoading,
  (newLoadingState) => {
    if (!newLoadingState) oldData.value = transformedData.value;
  },
  { immediate: true }
);

const data = computed(() => {
  const datasets: ChartData[] = [
    {
      label: 'Total Discoveries',
      backgroundColor: chartColours.green,
      borderColor: chartColours.green + '70',
      data: Object.values(transformedData.value).map((day) => day.discoveries || null),
    },
  ];

  if (debouncedSortedCategories.value[0] === 'SolarSystem' && debouncedSortedCategories.value.length === 1) {
    const tags = Object.values(transformedData.value).map((day) => day.correct || null);
    const mistags = Object.values(transformedData.value).map((day) => day.incorrect || null);
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
  } else if (debouncedSortedCategories.value.length > 1) {
    const mappedDatasets = debouncedSortedCategories.value.map((cat) => {
      const categoryDiscoveries = Object.values(transformedData.value).map((day) => day[cat] || null);
      const backgroundColor = categoryMapping[cat].colour;

      return {
        label: categoryMapping[cat].label,
        data: categoryDiscoveries,
        backgroundColor,
      };
    });
    datasets.push(...mappedDatasets);
  }
  datasets.forEach((item) => (item.borderColor = item.backgroundColor + '70'));

  return {
    labels: Object.keys(transformedData.value).map((ts) => new Date(ts).toLocaleDateString()),
    datasets,
  };
});

const options = {
  responsive: true,
  maintainAspectRatio: true,
};
</script>

<template>
  <!--Discoveries over time-->
  <Line
    :data="data"
    :options="options"
    class="chart"
  />

  <QInnerLoading
    :showing="isLoading"
    label="Loading Data..."
  />
</template>
