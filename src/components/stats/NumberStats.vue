<script setup lang="ts">
import { getPercentage } from '@/logic/logic';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import DataTable from '../table/DataTable.vue';
import type { TableHeadings } from '@/types/data';

const dataStore = useDataStore();
const { filteredData, amountTagged, dataLength, dateRange } = storeToRefs(dataStore);

// tagged
const systemsTaggedPercent = computed(() => getPercentage(amountTagged.value, dataLength.value));

// not tagged
const systemsNotTagged = computed(
  () => filteredData.value.filter((item) => !item['Correctly Tagged'] && item.Name).length
);
const systemsNotTaggedPercent = computed(() => getPercentage(systemsNotTagged.value, dataLength.value));

// proc name
const systemsProcName = computed(() => filteredData.value.filter((item) => !item.Name && item.Discoverer).length);
const systemsProcNamePercent = computed(() => getPercentage(systemsProcName.value, dataLength.value));

// undiscovered
const systemsUndiscovered = computed(() => filteredData.value.filter((item) => !item.Name && !item.Discoverer).length);
const systemsUndiscoveredPercent = computed(() => getPercentage(systemsUndiscovered.value, dataLength.value));

// discoverers
const discovererNumber = computed(
  () => new Set<string>(filteredData.value.filter((item) => item.Discoverer).map((item) => item.Discoverer)).size
);

const differenceInDays = computed(() => {
  if (dateRange.value.some((date) => !date)) return 0;

  const [date1, date2] = dateRange.value;

  // To calculate the time difference of two dates
  const diffTime = new Date(date2!).getTime() - new Date(date1!).getTime();

  // To calculate the no. of days between two dates
  const diffDays = diffTime / (1000 * 3600 * 24) + 1; // NoSonar this calculates number of days between two dates
  return diffDays;
});

// average discoveries per day
const avgDiscoveriesPerDay = computed(
  () => (differenceInDays.value ? (dataLength.value / differenceInDays.value).toFixed(2) : 0) // NoSonar this generates two decimals
);

// average players discovering per day
const avgDiscoverersPerDay = computed(() => {
  const timestampObj: {
    [key: string]: Set<string>;
  } = {};

  for (const dataObj of filteredData.value.filter((item) => item.Discoverer)) {
    const ts = dataObj.Timestamp;
    timestampObj[ts] ??= new Set<string>();
    timestampObj[ts].add(dataObj.Discoverer);
  }

  const discoverersPerDay = Object.values(timestampObj).map((item) => item.size);

  const totalDiscoverers = discoverersPerDay.reduce((a, b) => {
    return a + b;
  }, 0);

  return differenceInDays.value ? (totalDiscoverers / differenceInDays.value).toFixed(2) : 0;
});

// average hub tags per day
const avgCorrectTagsPerDay = computed(() =>
  differenceInDays.value ? (amountTagged.value / differenceInDays.value || 0).toFixed(2) : 0
);

// average incorrect hub tags per day
const avgIncorrectTagsPerDay = computed(() =>
  differenceInDays.value
    ? ((systemsNotTagged.value + systemsProcName.value) / differenceInDays.value || 0).toFixed(2)
    : 0
);

// duplicates
const systemsDuplicates = computed(() => {
  const systemTracker: {
    [key: string]: number;
  } = {};

  for (const system of filteredData.value) {
    if (system.Name) {
      systemTracker[system.Name] ??= 0;
      systemTracker[system.Name]++;
    }
  }

  return Object.entries(systemTracker).filter((item) => item[1] > 1);
});

const headers: TableHeadings = {
  normal: ['Name', 'Amount of duplicates'],
};

const getDate = (dateString: string | undefined) => (dateString ? new Date(dateString).toLocaleDateString() : '-');
</script>

<template>
  <details open>
    <summary>Number Stats</summary>
    <div class="number-stats-wrapper">
      <div>Tagged:</div>
      <div>{{ amountTagged }} ({{ systemsTaggedPercent }}%)</div>
      <div>Not/incorrectly tagged:</div>
      <div>{{ systemsNotTagged }} ({{ systemsNotTaggedPercent }}%)</div>
      <div>Procedural name:</div>
      <div>{{ systemsProcName }} ({{ systemsProcNamePercent }}%)</div>
      <div v-if="systemsUndiscovered">Undiscovered:</div>
      <div v-if="systemsUndiscovered">{{ systemsUndiscovered }} ({{ systemsUndiscoveredPercent }}%)</div>
      <div>Number of discoverers:</div>
      <div>{{ discovererNumber }}</div>
      <div>Average discoveries per day:</div>
      <div>{{ avgDiscoveriesPerDay }}</div>
      <div>Average number of players per day:</div>
      <div>{{ avgDiscoverersPerDay }}</div>
      <div>Average number of Hub tags per day:</div>
      <div>{{ avgCorrectTagsPerDay }}</div>
      <div>Average non-Hub tagged systems per day:</div>
      <div>{{ avgIncorrectTagsPerDay }}</div>
      <div>Earliest Discovery:</div>
      <div>{{ getDate(dateRange[0]) }}</div>
      <div>Latest Discovery:</div>
      <div>{{ getDate(dateRange[1]) }}</div>
      <div v-if="false">Duplicate system names:</div>
      <div v-if="false">{{ systemsDuplicates.length }}</div>

      <DataTable
        v-if="false"
        :headers="headers"
        :data="systemsDuplicates.flat()"
      />
    </div>
  </details>
</template>

<style scoped lang="scss">
.number-stats-wrapper {
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 0.5rem 1rem;
  width: fit-content;
}
</style>
