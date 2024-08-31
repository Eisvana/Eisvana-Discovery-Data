<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import ChartDropdown from '@/components/ChartDropdown.vue';
import DiscovererChart from '@/components/charts/DiscovererChart.vue';
import PlatformChart from '@/components/charts/PlatformChart.vue';
import TagChart from '@/components/charts/TagChart.vue';
import DiscoveriesChart from '@/components/charts/DiscoveriesChart.vue';
import PlayerPlatformChart from '@/components/charts/PlayerPlatformChart.vue';
import ContributionChart from '@/components/charts/ContributionChart.vue';
import PlatformTimeChart from '@/components/charts/PlatformTimeChart.vue';
import PlayerTimeChart from '@/components/charts/PlayerTimeChart.vue';
import DiscoveryTypes from '@/components/charts/DiscoveryTypes.vue';

const dataStore = useDataStore();
const { dataLength } = storeToRefs(dataStore);

const group = 'chart';
</script>

<template>
  <p class="text-center text-body2">Charting data over time can freeze the page for multiple seconds!</p>
  <div
    v-if="dataLength"
    class="column"
  >
    <ChartDropdown
      :group
      summary="Discoveries per Player"
    >
      <DiscovererChart />
    </ChartDropdown>

    <ChartDropdown
      :group
      summary="Discoveries per Category"
    >
      <DiscoveryTypes />
    </ChartDropdown>

    <ChartDropdown
      :group
      summary="Discoveries per Platform"
    >
      <PlatformChart />
    </ChartDropdown>

    <ChartDropdown
      :group
      summary="Discoveries per Day"
    >
      <TagChart />
    </ChartDropdown>

    <ChartDropdown
      :group
      summary="Discoveries over Time"
    >
      <DiscoveriesChart />
    </ChartDropdown>

    <ChartDropdown
      :group
      summary="Players per Platform"
    >
      <PlayerPlatformChart />
    </ChartDropdown>

    <ChartDropdown
      :group
      summary="Average Discoveries"
    >
      <ContributionChart />
    </ChartDropdown>

    <ChartDropdown
      :group
      summary="Platforms over Time"
    >
      <PlatformTimeChart />
    </ChartDropdown>

    <ChartDropdown
      :group
      summary="Players over Time"
    >
      <PlayerTimeChart />
    </ChartDropdown>
  </div>
</template>
