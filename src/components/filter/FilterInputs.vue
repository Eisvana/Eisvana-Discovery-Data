<script setup lang="ts">
import ColumnFilter from './ColumnFilter.vue';
import ActionButtons from '../ActionButtons.vue';
import RegionFilter from './RegionFilter.vue';
import CategoryFilter from './CategoryFilter.vue';
</script>

<template>
  <QForm class="q-mb-sm q-gutter-xs">
    <CategoryFilter class="full-width shadow-1" />
    <ColumnFilter class="full-width shadow-1" />
    <RegionFilter class="full-width shadow-1" />
    <ActionButtons class="full-width" />
  </QForm>
</template>
