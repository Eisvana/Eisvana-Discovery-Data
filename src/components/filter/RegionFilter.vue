<script setup lang="ts">
import type { Hub } from '@/types/data';
import { computed } from 'vue';
import hubRegions from '@/assets/regions.json';
import { GalaxyMapping } from '@/objects/mappings';
import RegionSwitch from './RegionSwitch.vue';

const props = defineProps<{
  hub: Hub;
}>();

const galaxy = computed(() => GalaxyMapping[props.hub]);
</script>

<template>
  <fieldset>
    <details>
      <summary>Filter Regions for {{ galaxy }}</summary>
      <legend>Filter Regions for {{ galaxy }}:</legend>
      <div class="region-switches">
        <RegionSwitch
          v-for="(regionName, index) in Object.values(hubRegions[hub])"
          :id="regionName"
          :label="`${regionName} (HUB${index + 1})`"
        />
      </div>
    </details>
  </fieldset>
</template>

<style scoped lang="scss">
.region-switches {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}
</style>
@/objects/mappings
