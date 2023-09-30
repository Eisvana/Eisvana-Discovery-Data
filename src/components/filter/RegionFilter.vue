<script setup lang="ts">
import hubRegions from '@/assets/regions.json';
import Switch from '../Switch.vue';
import { useFilterStore } from '@/stores/filter';
import { storeToRefs } from 'pinia';

const filterStore = useFilterStore();
const { regions } = storeToRefs(filterStore);

const regionObj = hubRegions;
for (const region of Object.values(regionObj)) {
  const hubRegions = (regions.value ??= {});
  hubRegions[region] = true;
}
</script>

<template>
  <fieldset>
    <details>
      <summary>Filter Regions</summary>
      <legend>Filter Regions:</legend>
      <button
        class="inline"
        @click="filterStore.invertRegionSwitches()"
      >
        Invert Selection
      </button>
      <div class="stat-grid">
        <Switch
          v-for="(regionName, index) in Object.values(hubRegions)"
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
.inline {
  width: auto;
}

.stat-grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
</style>
