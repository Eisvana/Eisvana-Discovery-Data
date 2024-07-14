<script setup lang="ts">
import { getPercentage } from '@/helpers/maths';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { computed, toRefs } from 'vue';
import { getFormattedUTCDateString, getUTCDateString } from '@/helpers/date';
import { dayInMs } from '@/variables/time';
import { reactiveComputed } from '@vueuse/core';
import type { NumberStats } from '@/types/data';
import { useFilterStore } from '@/stores/filter';

const dataStore = useDataStore();
const { filteredData, amountTagged, dataLength, dateRange } = storeToRefs(dataStore);

const filterStore = useFilterStore();
const { sortedCategories } = storeToRefs(filterStore);

const differenceInDays = computed(() => {
  if (dateRange.value.some((date) => !date)) return 0;

  const [date1, date2] = dateRange.value;

  // To calculate the time difference of two dates
  // the dates are definitely defined, otherwise the function would've returned above
  const diffTime = new Date(date2!).getTime() - new Date(date1!).getTime();

  // To calculate the no. of days between two dates
  const diffDays = diffTime / dayInMs + 1; // NoSonar this calculates number of days between two dates
  return diffDays;
});

const dataHasSystems = computed(() => sortedCategories.value.includes('SolarSystem'));

const numberStats = reactiveComputed(() => {
  const resultObj: NumberStats = {
    systemsNotTagged: 0,
    allProcName: 0,
    systemsProcName: 0,
    discovererNumber: 0,
    avgDiscoverersPerDay: '0', // because .toFixed() converts to string
    systemsDuplicates: [],
  };

  // tracking objects
  const discoverers = new Set<string>();
  const timestampObj: Record<string, Set<string>> = {};
  const nameCountTracker: Record<string, number> = {};

  // prettier-ignore
  for (let i = 0; i < filteredData.value.length; i++) { // NoSonar this is for better performance
    const item = filteredData.value[i];

    // not tagged
    if (item['Correctly Prefixed'] === false && item.Name) resultObj.systemsNotTagged++;

    // proc name system
    if (item.Category === 'SolarSystem' && !item.Name && item.Discoverer) resultObj.systemsProcName++;

    // proc name other
    if (!item.Name && item.Discoverer) resultObj.allProcName++;

    // discoverers
    if (item.Discoverer) {
      discoverers.add(item.Discoverer);
      const utcDate = getUTCDateString(item.Timestamp);
      timestampObj[utcDate] ??= new Set<string>();
      timestampObj[utcDate].add(item.Discoverer);
    }

    // duplicates
    if (item.Name) {
      nameCountTracker[item.Name] ??= 0;
      nameCountTracker[item.Name]++;
    }
  }

  // amount of discoverers
  resultObj.discovererNumber = discoverers.size;

  // discoverers per day
  const discoverersPerDay = Object.values(timestampObj).map((item) => item.size);

  // average discoverers per day
  const totalDiscoverers = discoverersPerDay.reduce((a, b) => a + b, 0);
  resultObj.avgDiscoverersPerDay = differenceInDays ? (totalDiscoverers / differenceInDays.value).toFixed(2) : '0'; // NoSonar this generates two decimals

  // duplicate name tracker
  Object.entries(nameCountTracker).filter((item) => item[1] > 1);

  return resultObj;
});

const { systemsNotTagged, systemsProcName, allProcName, discovererNumber, avgDiscoverersPerDay, systemsDuplicates } =
  toRefs(numberStats);

// tagged
const systemsTaggedPercent = computed(() => getPercentage(amountTagged.value, dataLength.value));

// not tagged
const systemsNotTaggedPercent = computed(() => getPercentage(systemsNotTagged.value, dataLength.value));

// proc name system
const systemsProcNamePercent = computed(() => getPercentage(systemsProcName.value, dataLength.value));

// proc name all
const allProcNamePercent = computed(() => getPercentage(allProcName.value, dataLength.value));

// average discoveries per day
const avgDiscoveriesPerDay = computed(
  () => (differenceInDays.value ? (dataLength.value / differenceInDays.value).toFixed(2) : 0) // NoSonar this generates two decimals
);

// average prefixes per day
const avgCorrectTagsPerDay = computed(
  () => (differenceInDays.value ? (amountTagged.value / differenceInDays.value).toFixed(2) : 0) // NoSonar this generates two decimals
);

// average incorrect prefixes per day
const avgIncorrectTagsPerDay = computed(
  () =>
    differenceInDays.value ? ((systemsNotTagged.value + systemsProcName.value) / differenceInDays.value).toFixed(2) : 0 // NoSonar this generates two decimals
);

const duplicateNamesHeaders = ['Name', 'Amount of duplicates'];

const getDate = (dateString: string | undefined) => (dateString ? getFormattedUTCDateString(dateString) : '-');
</script>

<template>
  <QExpansionItem
    label="Number Stats"
    default-opened
  >
    <div class="number-stats-wrapper q-px-md q-mt-sm">
      <template v-if="dataHasSystems">
        <div>Tagged:</div>
        <div>{{ amountTagged }} ({{ systemsTaggedPercent }}%)</div>
        <div>Not/incorrectly prefixed:</div>
        <div>{{ systemsNotTagged }} ({{ systemsNotTaggedPercent }}%)</div>
        <div>Procedural name systems:</div>
        <div>{{ systemsProcName }} ({{ systemsProcNamePercent }}%)</div>
      </template>
      <div>Procedural name:</div>
      <div>{{ allProcName }} ({{ allProcNamePercent }}%)</div>
      <div>Number of discoverers:</div>
      <div>{{ discovererNumber }}</div>
      <div>Average discoveries per day:</div>
      <div>{{ avgDiscoveriesPerDay }}</div>
      <div>Average number of players per day:</div>
      <div>{{ avgDiscoverersPerDay }}</div>
      <template v-if="dataHasSystems">
        <div>Average number of prefixes per day:</div>
        <div>{{ avgCorrectTagsPerDay }}</div>
        <div>Average non-prefixed systems per day:</div>
        <div>{{ avgIncorrectTagsPerDay }}</div>
      </template>
      <div>Earliest Discovery:</div>
      <div>{{ getDate(dateRange[0]) }}</div>
      <div>Latest Discovery:</div>
      <div>{{ getDate(dateRange[1]) }}</div>
      <div v-if="false">Duplicate system names:</div>
      <div v-if="false">{{ systemsDuplicates.length }}</div>
    </div>

    <QMarkupTable v-if="false">
      <thead>
        <tr>
          <th
            v-for="header in duplicateNamesHeaders"
            scope="col"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="[name, amount] in systemsDuplicates">
          <td>{{ name }}</td>
          <td>{{ amount }}</td>
        </tr>
      </tbody>
    </QMarkupTable>
  </QExpansionItem>
</template>
