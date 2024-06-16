<script setup lang="ts">
import DiscovererStats from '@/components/stats/DiscovererStats.vue';
import PlatformStats from '@/components/stats/PlatformStats.vue';
import NumberStats from '@/components/stats/NumberStats.vue';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';

const dataStore = useDataStore();
const { dataLength } = storeToRefs(dataStore);
</script>

<template>
  <div
    v-if="dataLength"
    class="column q-gutter-y-lg"
  >
    <NumberStats />
    <DiscovererStats />
    <PlatformStats />
  </div>
</template>
