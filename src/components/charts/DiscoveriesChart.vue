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
import { getUTCDateString, getDatesBetween } from '@/helpers/date';
import { refDebounced } from '@vueuse/core';
import { debounceDelay } from '@/variables/debounce';
import type { TimestampData } from '@/types/data';
import type { ChartData } from '@/types/chart';
import { useFilterStore } from '@/stores/filter';
import { chartOptions } from '@/variables/chart';
import ChartContainer from '../ChartContainer.vue';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const dataStore = useDataStore();
const { filteredData, dateRange, isLoading } = storeToRefs(dataStore);

const filterStore = useFilterStore();
const { sortedCategories } = storeToRefs(filterStore);

const debouncedFilteredData = refDebounced(filteredData, debounceDelay);
const debouncedDateRange = refDebounced(dateRange, debounceDelay);

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
      tags: 0,
      mistags: 0,
      discoveries: 0
    };
  }

  const timestamps = Object.keys(timestampData);

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
    const index = timestamps.indexOf(utcDate);
    if (index === -1) break;
    const isCorrect = dataObj['Correctly Prefixed'];

    const category = dataObj.Category;

    for (let j = index; j < timestamps.length; j++) {
      const key = timestamps[j];
      const dayObj = timestampData[key];
      dayObj.discoveries++;
      dayObj[isCorrect ? 'tags' : 'mistags']++;
      sortedCategories.value.forEach((cat) => (dayObj[cat] ??= 0));
      if (dayObj[category] !== undefined) dayObj[category]++;
    }
  }
  return timestampData;
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
  const labels = Object.keys(transformedData.value).map((ts) => new Date(ts).toLocaleDateString());

  return {
    labels,
    datasets,
  };
});
</script>

<template>
  <!--Discoveries over Time-->
  <ChartContainer>
    <Line
      :data
      :options="chartOptions"
      class="chart"
    />
  </ChartContainer>
</template>
