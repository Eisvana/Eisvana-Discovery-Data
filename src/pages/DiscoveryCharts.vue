<script setup lang="ts">
import DiscovererChart from '@/components/stats/charts/DiscovererChart.vue';
import PlatformChart from '@/components/stats/charts/PlatformChart.vue';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import TagChart from '@/components/stats/charts/TagChart.vue';
import DiscoveriesChart from '@/components/stats/charts/DiscoveriesChart.vue';
import PlayerPlatformChart from '@/components/stats/charts/PlayerPlatformChart.vue';
import ContributionChart from '@/components/stats/charts/ContributionChart.vue';
import PlatformTimeChart from '@/components/stats/charts/PlatformTimeChart.vue';
import PlayerTimeChart from '@/components/stats/charts/PlayerTimeChart.vue';

const dataStore = useDataStore();
const { filteredData } = storeToRefs(dataStore);
</script>

<template>
  <p class="freeze-warning">Charting data over time can freeze the page for multiple seconds!</p>
  <div
    v-if="filteredData.length"
    class="stats-wrapper"
  >
    <DiscovererChart />
    <PlatformChart />
    <TagChart />
    <DiscoveriesChart />
    <PlayerPlatformChart />
    <ContributionChart />
    <PlatformTimeChart />
    <PlayerTimeChart />
  </div>
</template>

<style scoped lang="scss">
.freeze-warning {
  text-align: center;
  font-size: initial;
}
</style>
