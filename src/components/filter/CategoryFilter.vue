<script setup lang="ts">
import { useFilterStore } from '@/stores/filter';
import { storeToRefs } from 'pinia';
import Switch from '../Switch.vue';
import { availableCategories } from '@/variables/categories';
import { onMounted, onUnmounted } from 'vue';

const filterStore = useFilterStore();
const { categories } = storeToRefs(filterStore);

// systems should be checked by default, everything else should be disabled
function disableAllButSystem() {
  for (const categoryName of Object.keys(availableCategories)) {
    categories.value[categoryName] = categoryName === availableCategories.system;
  }
}

type AvailableCategories = keyof typeof availableCategories;

function toggleCategory(e: Event, categoryName: AvailableCategories) {
  const { target } = e;
  if (!(target instanceof HTMLInputElement)) return;
  categories.value[categoryName] = target.checked;
}

// setTimeout so that this code is executed after the reset action (setTimeout pushes its content to the end of the callstack)
function resetFunc() {
  setTimeout(() => {
    disableAllButSystem();
  }, 0);
}

onMounted(() => {
  disableAllButSystem();
  document.addEventListener('reset', resetFunc);
});
onUnmounted(() => document.removeEventListener('reset', resetFunc));
</script>

<template>
  <fieldset>
    <details>
      <summary>Filter Categories</summary>
      <legend>Filter Categories:</legend>
      <div class="stat-grid dynamic-cols">
        <Switch
          v-for="(displayName, categoryName) in availableCategories"
          :checked="categories[categoryName]"
          :id="categoryName"
          :label="displayName"
          @change="(e: Event) => toggleCategory(e, categoryName)"
        />
      </div>
    </details>
  </fieldset>
</template>
