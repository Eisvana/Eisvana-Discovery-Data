<script setup lang="ts">
import { useFilterStore } from '@/stores/filter';
import type { DiscoveryData } from '@/types/data';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const filterStore = useFilterStore();

const { data } = storeToRefs(filterStore);

const isLoading = ref(false);

const resetStore = () => filterStore.$reset();

async function loadData() {
  const galaxies = filterStore.galaxy;
  const galaxyMapping = {
    euclid: 'GHub',
    calypso: 'CalHub',
    eissentam: 'EisHub',
  };

  const json: DiscoveryData[] = [];

  isLoading.value = true;
  for (const galaxy of galaxies) {
    try {
      const mappedName = galaxyMapping[galaxy];
      const { default: importedData } = await import(`/src/data/${mappedName}/${mappedName}.json`);
      json.push(...importedData);
      data.value = json;
    //  applyFilter();
    } catch {
      data.value = [];
    }
  }
  isLoading.value = false;
}
</script>

<template>
  <div class="actions">
    <button
      :aria-busy="isLoading"
      role="button"
      type="submit"
      @click="loadData()"
    >
      Apply Filter
    </button>

    <input
      role="button"
      type="reset"
      value="Reset Filter"
      @click="resetStore"
    />
  </div>
</template>

<style scoped lang="scss">
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  & > * {
    flex-basis: content;
    flex-grow: 1;
    max-width: 50%;
  }
}
</style>
