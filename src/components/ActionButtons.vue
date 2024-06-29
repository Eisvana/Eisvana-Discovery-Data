<script setup lang="ts">
import { useFilterStore } from '@/stores/filter';

const filterStore = useFilterStore();
</script>

<template>
  <QCard bordered>
    <QBtn
      class="full-width"
      label="Reset Filter"
      type="reset"
      flat
      @click="filterStore.resetStore"
    />
  </QCard>
</template>
