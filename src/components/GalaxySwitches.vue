<script setup lang="ts">
import type { Galaxy } from '@/types/data';
import GalaxySwitch from './GalaxySwitch.vue';

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
</script>

<template>
  <fieldset>
    <details>
      <summary>Galaxy</summary>
      <legend>Select Galaxy:</legend>
      <div class="galaxy-switches">
        <GalaxySwitch
          v-for="galaxy in galaxies"
          :id="galaxy.id as Galaxy"
          :label="galaxy.label"
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
