<script setup lang="ts">
import Switch from '../Switch.vue';
import { useFilterStore } from '@/stores/filter';
import { storeToRefs } from 'pinia';

const galaxies = [
  {
    id: 'GHub',
    label: 'Euclid',
  },
  {
    id: 'CalHub',
    label: 'Calypso',
  },
  {
    id: 'EisHub',
    label: 'Eissentam',
  },
];

const filterStore = useFilterStore();
const { hubs } = storeToRefs(filterStore);
</script>

<template>
  <fieldset>
    <details>
      <summary>Galaxy</summary>
      <legend>Select Galaxy:</legend>
      <div class="galaxy-switches">
        <Switch
          v-for="galaxy in galaxies"
          :label="galaxy.label"
          :id="galaxy.id"
          :checked="hubs[galaxy.id]"
          @change="(e: Event) => (hubs[galaxy.id] = (e.target as HTMLInputElement).checked)"
        />
      </div>
    </details>
  </fieldset>
</template>

<style scoped lang="scss">
.galaxy-switches {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 2rem;
}
</style>
