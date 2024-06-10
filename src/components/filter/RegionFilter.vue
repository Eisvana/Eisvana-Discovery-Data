<script setup lang="ts">
import { regions as eisvanaRegions } from '@/variables/regions';
import Switch from '../Switch.vue';
import { useFilterStore } from '@/stores/filter';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted } from 'vue';
import type { ValueOf } from '@/types/utility';

const filterStore = useFilterStore();
const { regions } = storeToRefs(filterStore);

const eisvanaRegionNames = Object.values(eisvanaRegions);

type EisvanaRegions = ValueOf<typeof eisvanaRegions>;

enableAll();

function enableAll() {
  for (const region of eisvanaRegionNames) {
    const storedRegions = (regions.value ??= {});
    storedRegions[region] ||= true;
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

function toggleRegion(e: Event, regionName: EisvanaRegions) {
  const { target } = e;
  if (!(target instanceof HTMLInputElement)) return;
  regions.value[regionName] = target.checked;
}
</script>

<template>
  <fieldset>
    <QExpansionItem label="Filter Regions">
      <legend>Filter Regions:</legend>
      <button
        class="q-mb-sm"
        @click="filterStore.invertRegionSwitches()"
      >
        Invert Selection
      </button>
      <div class="stat-grid dynamic-cols">
        <Switch
          v-for="(regionName, index) in eisvanaRegionNames"
          :checked="regions[regionName]"
          :id="regionName"
          :label="`${regionName} (EV${index + 1})`"
          @change="(e: Event) => toggleRegion(e, regionName)"
        />
      </div>
    </QExpansionItem>
  </fieldset>
</template>
