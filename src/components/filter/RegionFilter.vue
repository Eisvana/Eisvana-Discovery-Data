<script setup lang="ts">
import type { Hub } from '@/types/data';
import hubRegions from '@/assets/regions.json';
import Switch from '../Switch.vue';
import { useFilterStore } from '@/stores/filter';
import { storeToRefs } from 'pinia';
import { GalaxyMapping } from '@/objects/mappings';
import { computed } from 'vue';

const props = defineProps<{
  hub: Hub;
}>();

const filterStore = useFilterStore();
const { regions } = storeToRefs(filterStore);

const galaxy = computed(() => GalaxyMapping[props.hub]);

const regionObj = hubRegions[props.hub];
for (const region of Object.values(regionObj)) {
  const hubRegions = (regions.value[props.hub] ??= {});
  hubRegions[region] = true;
}
</script>

<template>
  <fieldset>
    <details>
      <summary>Filter Regions for {{ galaxy }}</summary>
      <legend>Filter Regions for {{ galaxy }}:</legend>
      <button class="inline" @click="filterStore.invertRegionSwitches(hub)">Invert Selection</button>
      <div class="stat-grid">
        <Switch
          v-for="(regionName, index) in Object.values(hubRegions[hub])"
          :id="regionName"
          :label="`${regionName} (HUB${index + 1})`"
          :checked="regions[hub][regionName]"
          @change="(e: Event) => (regions[hub][regionName] = (e.target as HTMLInputElement).checked)"
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
