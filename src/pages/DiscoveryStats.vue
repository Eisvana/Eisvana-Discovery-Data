<script setup lang="ts">
import DiscovererStats from '@/components/stats/DiscovererStats.vue';
import PlatformStats from '@/components/stats/PlatformStats.vue';
import NumberStats from '@/components/stats/NumberStats.vue';
import DiscovererChart from '@/components/stats/charts/DiscovererChart.vue';
import PlatformChart from '@/components/stats/charts/PlatformChart.vue';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import TagChart from '@/components/stats/charts/TagChart.vue';
import DiscoveriesChart from '@/components/stats/charts/DiscoveriesChart.vue';
import PlayerPlatformChart from '@/components/stats/charts/PlayerPlatformChart.vue';
import ContributionChart from '@/components/stats/charts/ContributionChart.vue';
import PlatformTimeChart from '@/components/stats/charts/PlatformTimeChart.vue';

const dataStore = useDataStore();
const { filteredData } = storeToRefs(dataStore);
</script>

<template>
  <div
    v-if="filteredData.length"
    class="stats-wrapper"
  >
    <NumberStats />
    <DiscovererStats />
    <PlatformStats />
    <DiscovererChart />
    <PlatformChart />
    <TagChart />
    <DiscoveriesChart />
    <PlayerPlatformChart />
    <ContributionChart />
    <PlatformTimeChart />
  </div>
</template>

<style scoped lang="scss">
.stats-wrapper {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;

  & > * {
    flex-grow: 1;
  }
}
</style>
