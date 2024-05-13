<script setup lang="ts">
import { regions as eisvanaRegions } from '@/variables/regions';
import Switch from '../Switch.vue';
import { useFilterStore } from '@/stores/filter';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted } from 'vue';

const filterStore = useFilterStore();
const { regions } = storeToRefs(filterStore);

enableAll();

function enableAll() {
  for (const regionName of Object.values(eisvanaRegions)) {
    regions.value[regionName] ||= true;
  }
}

// setTimeout so that this code is executed after the reset action (setTimeout pushes its content to the end of the callstack)
function resetFunc() {
  setTimeout(() => {
    enableAll();
  }, 0);
}

onMounted(() => document.addEventListener('reset', resetFunc));
onUnmounted(() => document.removeEventListener('reset', resetFunc));

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
</style>
