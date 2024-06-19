<script setup lang="ts">
import DiscovererStats from '@/components/stats/DiscovererStats.vue';
import PlatformStats from '@/components/stats/PlatformStats.vue';
import NumberStats from '@/components/stats/NumberStats.vue';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import SkeletonTable from '@/components/SkeletonTable.vue';
import { ref } from 'vue';

const dataStore = useDataStore();
const { dataLength, isLoading } = storeToRefs(dataStore);

const amountOfStatRows = 5;
const amountOfStatItems = amountOfStatRows * 2;

const isVisible = ref(false);

// delay data component mounts until page transition is done, so the transition happens quickly and isn't delayed
const transitionDuration = 300;
setTimeout(() => {
  isVisible.value = true;
}, transitionDuration);
</script>

<template>
  <div class="transition-container">
    <Transition>
      <template v-if="!isLoading && isVisible">
        <div
          v-if="dataLength"
          class="column q-gutter-y-lg"
        >
          <NumberStats />
          <DiscovererStats />
          <PlatformStats />
        </div>
      </template>

      <div
        v-else
        class="column q-px-md q-gutter-y-xl"
      >
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
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.transition-container {
  display: grid;

  & > * {
    grid-area: 1 / 1;
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
