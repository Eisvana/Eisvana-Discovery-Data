<script setup lang="ts">
import { useFilterStore } from '@/stores/filter';
import { storeToRefs } from 'pinia';
import { availableCategories } from '@/variables/categories';
import { onMounted, onUnmounted } from 'vue';

const filterStore = useFilterStore();
const { categories } = storeToRefs(filterStore);

// systems should be checked by default, everything else should be disabled
const disableAllButSystem = () => (categories.value = ['system']);

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
    <QExpansionItem label="Filter Categories">
      <legend>Filter Categories:</legend>
      <div class="stat-grid dynamic-cols">
        <QToggle
          v-for="(displayName, categoryName) in availableCategories"
          v-model="categories"
          :label="displayName"
          :val="categoryName"
        />
      </div>
    </QExpansionItem>
  </fieldset>
</template>
