<script setup lang="ts">
import { useFilterStore } from '@/stores/filter';
import { storeToRefs } from 'pinia';
import Switch from './Switch.vue';
import type { Galaxy } from '@/types/data';

const props = defineProps<{
  id: Galaxy;
  label: string;
}>();

const filterStore = useFilterStore();
const { galaxy } = storeToRefs(filterStore);

function toggleGalaxy() {
  const index = galaxy.value.findIndex((item) => item === props.id);
  if (index === -1) {
    galaxy.value.push(props.id);
  } else {
    galaxy.value.splice(index, 1);
  }
}
</script>

<template>
  <Switch
    :id="id"
    :label="label"
    @change="toggleGalaxy"
  />
</template>
