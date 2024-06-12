<script setup lang="ts">
import { regions as eisvanaRegions } from '@/variables/regions';
import { useFilterStore } from '@/stores/filter';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted } from 'vue';

const filterStore = useFilterStore();
const { regions } = storeToRefs(filterStore);

const eisvanaRegionNames = Object.values(eisvanaRegions);

const enableAll = () => (regions.value = eisvanaRegionNames);

enableAll();

// setTimeout so that this code is executed after the reset action (setTimeout pushes its content to the end of the callstack)
function resetFunc() {
  setTimeout(() => {
    enableAll();
  }, 0);
}

onMounted(() => document.addEventListener('reset', resetFunc));
onUnmounted(() => document.removeEventListener('reset', resetFunc));
</script>

<template>
  <fieldset>
    <QExpansionItem label="Filter Regions">
      <legend>Filter Regions:</legend>
      <QBtn
        class="q-mb-sm"
        label="Invert Selection"
        outline
        no-caps
        @click="filterStore.invertRegionSwitches()"
      />

      <div class="stat-grid dynamic-cols">
        <QToggle
          v-for="(regionName, index) in eisvanaRegionNames"
          v-model="regions"
          :label="`${regionName} (EV${index + 1})`"
          :val="regionName"
        />
      </div>
    </QExpansionItem>
  </fieldset>
</template>
