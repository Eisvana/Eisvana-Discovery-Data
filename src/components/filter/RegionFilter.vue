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

for (const regionObj of Object.values(hubRegions)) {
  for (const region of Object.values(regionObj)) {
    regions.value[region] = true;
  }
}
</script>

<template>
  <fieldset>
    <details>
      <summary>Filter Regions for {{ galaxy }}</summary>
      <legend>Filter Regions for {{ galaxy }}:</legend>
      <div class="stat-grid">
        <Switch
          v-for="(regionName, index) in Object.values(hubRegions[hub])"
          :id="regionName"
          :label="`${regionName} (HUB${index + 1})`"
          :checked="regions[regionName]"
          @change="(e: Event) => (regions[regionName] = (e.target as HTMLInputElement).checked)"
        />
      </div>
    </details>
  </fieldset>
</template>

<style scoped lang="scss">
.stat-grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
</style>
