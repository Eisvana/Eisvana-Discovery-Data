<script setup lang="ts">
import DiscovererStats from '@/components/stats/DiscovererStats.vue';
import PlatformStats from '@/components/stats/PlatformStats.vue';
import NumberStats from '@/components/stats/NumberStats.vue';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import SkeletonTable from '@/components/SkeletonTable.vue';

const dataStore = useDataStore();
const { dataLength, isLoading } = storeToRefs(dataStore);

const amountOfStatRows = 5;
const amountOfStatItems = amountOfStatRows * 2;
</script>

<template>
  <div
    :class="{ 'q-px-md q-gutter-y-xl': isLoading }"
    class="column q-gutter-y-lg"
  >
    <template v-if="!isLoading">
      <template v-if="dataLength">
        <NumberStats />
        <DiscovererStats />
        <PlatformStats />
      </template>
    </template>

    <template v-else>
      <div class="number-stats-wrapper">
        <QSkeleton
          v-for="_n in amountOfStatItems"
          width="200px"
          type="text"
        />
      </div>
      <SkeletonTable />
      <SkeletonTable />
    </template>
  </div>
</template>
