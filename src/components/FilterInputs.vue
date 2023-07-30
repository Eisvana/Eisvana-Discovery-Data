<script setup lang="ts">
import GalaxySwitches from './GalaxySwitches.vue';
import ColumnFilter from './ColumnFilter.vue';
import SearchButton from './SearchButton.vue';
</script>

<template>
  <form @submit.prevent>
    <GalaxySwitches />
    <ColumnFilter />
    <SearchButton />
  </form>
</template>

<style scoped lang="scss">
:deep(legend) {
  display: none;
}
</style>
