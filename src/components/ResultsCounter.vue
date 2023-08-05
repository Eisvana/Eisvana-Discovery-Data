<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';

const dataStore = useDataStore();
const { dataLength } = storeToRefs(dataStore);
</script>

<template>
  <div>Number of results: {{ dataLength }}</div>
</template>
