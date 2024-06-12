<script setup lang="ts">
import ColumnFilter from './ColumnFilter.vue';
import ActionButtons from '../ActionButtons.vue';
import RegionFilter from './RegionFilter.vue';
import CategoryFilter from './CategoryFilter.vue';
</script>

<template>
  <QForm class="q-gutter-xs">
    <CategoryFilter class="full-width" />
    <ColumnFilter class="full-width" />
    <RegionFilter class="full-width" />
    <ActionButtons class="full-width" />
  </QForm>
</template>
