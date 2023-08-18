<script setup lang="ts">
import GalaxySwitches from './GalaxySwitches.vue';
import ColumnFilter from './ColumnFilter.vue';
import ActionButtons from '../ActionButtons.vue';
import { useFilterStore } from '@/stores/filter';
import { storeToRefs } from 'pinia';
import RegionFilter from './RegionFilter.vue';

const filterStore = useFilterStore();
const { activeHubs } = storeToRefs(filterStore);
</script>

<template>
  <form @submit.prevent>
    <GalaxySwitches />
    <ColumnFilter />
    <RegionFilter
      v-for="hub in activeHubs"
      :hub="hub"
      :key="hub"
    />
    <ActionButtons />
  </form>
</template>

<style scoped lang="scss">
:deep(legend) {
  display: none;
}
</style>
