<script setup lang="ts">
import DiscovererStats from '@/components/stats/DiscovererStats.vue';
import PlatformStats from '@/components/stats/PlatformStats.vue';
import NumberStats from '@/components/stats/NumberStats.vue';
</script>

<template>
  <div class="stats-wrapper">
    <NumberStats />
    <DiscovererStats />
    <PlatformStats />
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
