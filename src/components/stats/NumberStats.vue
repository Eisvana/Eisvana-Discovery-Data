<script setup lang="ts">
import { getPercentage } from '@/logic/logic';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const dataStore = useDataStore();
const { filteredData, amountTagged, dataLength } = storeToRefs(dataStore);

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
</script>

<template>
  <details open>
    <summary>Number Stats</summary>
    <div class="number-stats-wrapper">
      <div>Tagged: {{ amountTagged }} ({{ systemsTaggedPercent }}%)</div>
      <div>Not/incorrectly tagged: {{ systemsNotTagged }} ({{ systemsNotTaggedPercent }}%)</div>
      <div>Procedural name: {{ systemsProcName }} ({{ systemsProcNamePercent }}%)</div>
      <div v-if="systemsUndiscovered">Undiscovered: {{ systemsUndiscovered }} ({{ systemsUndiscoveredPercent }}%)</div>
    </div>
  </details>
</template>

<style scoped lang="scss">
.number-stats-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
}
</style>
