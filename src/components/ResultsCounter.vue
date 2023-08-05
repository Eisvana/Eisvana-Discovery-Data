<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const dataStore = useDataStore();
const { filteredData } = storeToRefs(dataStore);

const counter = computed(() => filteredData.value.length);
</script>

<template>
  <div>Number of results: {{ counter }}</div>
</template>
