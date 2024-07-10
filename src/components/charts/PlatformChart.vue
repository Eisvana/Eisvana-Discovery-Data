<script setup lang="ts">
import { Bar, Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { computed, ref, watchEffect } from 'vue';
import { categoryMapping, chartColours, platformMapping } from '@/variables/mappings';
import type { Platform } from '@/types/platform';
import { chartOptions, barChartOptions } from '@/variables/chart';
import { refDebounced } from '@vueuse/core';
import { debounceDelay } from '@/variables/debounce';
import PieChartWrapper from '../PieChartWrapper.vue';
import type { PlatformDataArray } from '@/types/data';
import type { ChartData } from '@/types/chart';
import { useFilterStore } from '@/stores/filter';
import LoadingOverlay from '../LoadingOverlay.vue';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const dataStore = useDataStore();
const { filteredData, isLoading } = storeToRefs(dataStore);

const filterStore = useFilterStore();
const { sortedPlatforms, sortedCategories } = storeToRefs(filterStore);

const debouncedFilteredData = refDebounced(filteredData, debounceDelay);

const mappedLabels = computed(() => sortedPlatforms.value.map((platform) => platformMapping[platform].label));

const oldData = ref<PlatformDataArray[]>([]);

const platformStats = computed(() => {
  if (isLoading.value) return oldData.value;
  const platformData = new Map<Platform, Omit<PlatformDataArray, 'platform'>>();

  // prettier-ignore
  for (let i = 0; i < debouncedFilteredData.value.length; i++) {  // NoSonar this is for performance
    const data = debouncedFilteredData.value[i];
    if (!platformData.has(data.Platform))
      platformData.set(data.Platform, {
        discoveries: 0,
        tags: 0,
        mistags: 0,
      });

    const platformObject = platformData.get(data.Platform);
    if (!platformObject) continue;

    platformObject.discoveries++;
    sortedCategories.value.forEach((cat) => (platformObject[cat] ??= 0));
    const category = data.Category;
    if (platformObject[category] !== undefined) platformObject[category]++;
    if (data['Correctly Prefixed']) {
      platformObject.tags++;
    } else {
      platformObject.mistags++;
    }
  }

  const platformDataArray = Array.from(platformData);

  const sortedPlatformDataArray = platformDataArray.toSorted((a, b) => b[1].discoveries - a[1].discoveries);

  const joinedData: PlatformDataArray[] = sortedPlatformDataArray.map(([platform, data]) => ({ platform, ...data }));
  return joinedData;
});

watchEffect(() => {
  if (!isLoading.value) oldData.value = platformStats.value;
});

const barChartData = computed(() => {
  const datasets: ChartData[] = [];

  if (sortedCategories.value[0] === 'SolarSystem' && sortedCategories.value.length === 1) {
    const tags = platformStats.value.map((item) => item.tags);
    const mistags = platformStats.value.map((item) => item.mistags);
    datasets.push(
      {
        label: 'Tagged',
        backgroundColor: chartColours.blue,
        data: tags,
      },
      {
        label: 'Not Tagged',
        backgroundColor: chartColours.red,
        data: mistags,
      }
    );
  } else {
    const mappedDatasets = sortedCategories.value.map((cat) => {
      const categoryDiscoveries = platformStats.value.map((item) => item[cat] ?? 0);
      return {
        label: categoryMapping[cat].label,
        backgroundColor: sortedCategories.value.length === 1 ? chartColours.blue : categoryMapping[cat].colour,
        data: categoryDiscoveries,
      };
    });
    datasets.push(...mappedDatasets);
  }

  return {
    labels: mappedLabels.value,
    datasets,
  };
});

const pieChartData = computed(() => {
  const colours = sortedPlatforms.value.map((platform) => platformMapping[platform].colour);
  const discoveries = platformStats.value.map((item) => item.discoveries);

  return {
    labels: mappedLabels.value,
    datasets: [
      {
        backgroundColor: colours,
        data: discoveries,
      },
    ],
  };
});
</script>

<template>
  <!--Discoveries per Platform-->
  <div class="relative-position">
    <Bar
      :data="barChartData"
      :options="barChartOptions"
      class="chart"
    />

    <LoadingOverlay v-if="isLoading" />
  </div>

  <div class="relative-position">
    <PieChartWrapper>
      <Pie
        :data="pieChartData"
        :options="chartOptions"
      />
    </PieChartWrapper>

    <LoadingOverlay v-if="isLoading" />
  </div>
</template>
