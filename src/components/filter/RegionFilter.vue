<script setup lang="ts">
import {regions as eisvanaRegions} from '@/variables/regions';
import Switch from '../Switch.vue';
import { useFilterStore } from '@/stores/filter';
import { storeToRefs } from 'pinia';

const filterStore = useFilterStore();
const { regions } = storeToRefs(filterStore);

for (const region of Object.values(eisvanaRegions)) {
  const claimedRegions = (regions.value ??= {});
  claimedRegions[region] = true;
}
</script>

<template>
  <fieldset>
    <details>
      <summary>Filter Regions</summary>
      <legend>Filter Regions:</legend>
      <button
        class="invert-button"
        @click="filterStore.invertRegionSwitches()"
      >
        Invert Selection
      </button>
      <div class="stat-grid">
        <Switch
          v-for="(regionName, index) in Object.values(eisvanaRegions)"
          :id="regionName"
          :label="`${regionName} (EV${index + 1})`"
          :checked="regions[regionName]"
          @change="(e: Event) => (regions[regionName] = (e.target as HTMLInputElement).checked)"
        />
      </div>
    </details>
  </fieldset>
</template>

<style scoped lang="scss">
.invert-button {
  margin-block-end: 0.5rem;
}

.stat-grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
</style>
