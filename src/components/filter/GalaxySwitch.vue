<script setup lang="ts">
import { useFilterStore } from '@/stores/filter';
import { storeToRefs } from 'pinia';
import Switch from '../Switch.vue';
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
    const sortedHubs = {
      GHub: false,
      CalHub: false,
      EisHub: false,
    };

    galaxy.value.push(props.id);

    for (const hub of galaxy.value) {
      sortedHubs[hub] = true;
    }

    galaxy.value = Object.entries(sortedHubs)
      .filter((item) => item.includes(true))
      .map((item) => item[0]) as Galaxy[];
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
