<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import LoadingOverlay from './LoadingOverlay.vue';
import { storeToRefs } from 'pinia';

const dataStore = useDataStore();
const { isLoading } = storeToRefs(dataStore);
</script>

<template>
  <div class="relative-position chart-container q-mb-sm">
    <slot></slot>

    <LoadingOverlay v-if="isLoading" />
  </div>
</template>

<style scoped lang="scss">
:nth-child(n + 2 of .chart-container) {
  margin-block-start: 2rem;
}
</style>
