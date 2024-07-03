<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import ChartWrapper from '@/components/ChartWrapper.vue';
import DiscovererChart from '@/components/stats/charts/DiscovererChart.vue';
import PlatformChart from '@/components/stats/charts/PlatformChart.vue';
import TagChart from '@/components/stats/charts/TagChart.vue';
import DiscoveriesChart from '@/components/stats/charts/DiscoveriesChart.vue';
import PlayerPlatformChart from '@/components/stats/charts/PlayerPlatformChart.vue';
import ContributionChart from '@/components/stats/charts/ContributionChart.vue';
import PlatformTimeChart from '@/components/stats/charts/PlatformTimeChart.vue';
import PlayerTimeChart from '@/components/stats/charts/PlayerTimeChart.vue';
import DiscoveryTypes from '@/components/stats/charts/DiscoveryTypes.vue';

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
    <ChartWrapper
      :group
      summary="Discoveries and prefixes per player"
    >
      <DiscovererChart />
    </ChartWrapper>

    <ChartWrapper
      :group
      summary="Discoveries per Category"
    >
      <DiscoveryTypes />
    </ChartWrapper>

    <ChartWrapper
      :group
      summary="Discoveries and prefixes per platform"
    >
      <PlatformChart />
    </ChartWrapper>

    <ChartWrapper
      :group
      summary="Prefixes over time"
    >
      <TagChart />
    </ChartWrapper>

    <ChartWrapper
      :group
      summary="Discoveries over time"
    >
      <DiscoveriesChart />
    </ChartWrapper>

    <ChartWrapper
      :group
      summary="Players per platform"
    >
      <PlayerPlatformChart />
    </ChartWrapper>

    <ChartWrapper
      :group
      summary="Average contributions"
    >
      <ContributionChart />
    </ChartWrapper>

    <ChartWrapper
      :group
      summary="Platforms over time"
    >
      <PlatformTimeChart />
    </ChartWrapper>

    <ChartWrapper
      :group
      summary="Players over time"
    >
      <PlayerTimeChart />
    </ChartWrapper>
  </div>
</template>
