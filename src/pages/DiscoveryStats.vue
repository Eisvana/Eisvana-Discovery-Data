<script setup lang="ts">
import UniqueDiscoverers from '@/components/stats/DiscovererStats.vue';
</script>

<template>
  <div class="stats-wrapper">
    <UniqueDiscoverers />
  </div>
</template>

<style scoped lang="scss">
.stats-wrapper {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;

  & > * {
    flex-grow: 1;
  }
}
</style>
