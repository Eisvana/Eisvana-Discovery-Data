<script setup lang="ts">
import DiscovererStats from '@/components/stats/DiscovererStats.vue';
import PlatformStats from '@/components/stats/PlatformStats.vue';
import NumberStats from '@/components/stats/NumberStats.vue';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import SkeletonTable from '@/components/SkeletonTable.vue';
import FadeTransition from '@/components/FadeTransition.vue';

const dataStore = useDataStore();
const { dataLength, isLoading } = storeToRefs(dataStore);

const amountOfStatRows = 5;
const amountOfStatItems = amountOfStatRows * 2;
</script>

<template>
  <FadeTransition :condition="!isLoading">
    <template #default>
      <div
        v-if="dataLength"
        class="column q-gutter-y-lg"
      >
        <NumberStats />
        <DiscovererStats />
        <PlatformStats />
      </div>
    </template>

    <template #else>
      <div class="column q-px-md q-gutter-y-xl">
        <div class="number-stats-wrapper">
          <QSkeleton
            v-for="_n in amountOfStatItems"
            width="200px"
            type="text"
          />
        </div>
        <SkeletonTable />
        <SkeletonTable />
      </div>
    </template>
  </FadeTransition>
</template>
