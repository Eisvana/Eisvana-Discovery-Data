<script setup lang="ts">
import GalaxySwitches from './GalaxySwitches.vue';
import ColumnFilter from './ColumnFilter.vue';
import ActionButtons from './ActionButtons.vue';
</script>

<template>
  <form @submit.prevent>
    <GalaxySwitches />
    <ColumnFilter />
    <ActionButtons />
  </form>
</template>

<style scoped lang="scss">
:deep(legend) {
  display: none;
}
</style>
