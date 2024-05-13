<script setup lang="ts">
import ColumnFilter from './ColumnFilter.vue';
import ActionButtons from '../ActionButtons.vue';
import RegionFilter from './RegionFilter.vue';
import CategoryFilter from './CategoryFilter.vue';
</script>

<template>
  <form @submit.prevent>
    <CategoryFilter />
    <ColumnFilter />
    <RegionFilter />
    <ActionButtons />
  </form>
</template>

<style scoped lang="scss">
:deep(legend) {
  display: none;
}
</style>
