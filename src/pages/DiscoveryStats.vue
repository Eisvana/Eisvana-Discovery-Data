<script setup lang="ts">
import DiscovererStats from '@/components/stats/DiscovererStats.vue';
import PlatformStats from '@/components/stats/PlatformStats.vue';
import NumberStats from '@/components/stats/NumberStats.vue';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';

const dataStore = useDataStore();
const { filteredData } = storeToRefs(dataStore);
</script>

<template>
  <div
    v-if="filteredData.length"
    class="stats-wrapper"
  >
    <NumberStats class="full-width" />
    <DiscovererStats class="full-width" />
    <PlatformStats class="full-width" />
  </div>
</template>
