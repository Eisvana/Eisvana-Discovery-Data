<script setup lang="ts">
import { useFilterStore } from '@/stores/filter';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const filterStore = useFilterStore();
const { data: filteredData } = storeToRefs(filterStore);

const counter = computed(() => filteredData.value.length);
</script>

<template>
  <div>Number of results: {{ counter }}</div>
</template>
