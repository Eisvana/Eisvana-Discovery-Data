<script setup lang="ts">
import GalaxySwitch from './GalaxySwitch.vue';

const galaxies = [
  {
    id: 'euclid',
    label: 'Euclid',
  },
  {
    id: 'calypso',
    label: 'Calypso',
  },
  {
    id: 'eissentam',
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
          :id="galaxy.id"
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
