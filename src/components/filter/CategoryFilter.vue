<script setup lang="ts">
import { useFilterStore } from '@/stores/filter';
import { storeToRefs } from 'pinia';
import { availableCategories } from '@/variables/categories';

const filterStore = useFilterStore();
const { categories } = storeToRefs(filterStore);
</script>

<template>
  <fieldset>
    <QExpansionItem label="Filter Categories">
      <legend>Filter Categories:</legend>
      <QBtn
        class="q-mb-sm"
        label="Invert Selection"
        outline
        no-caps
        @click="filterStore.invertCategorySwitches()"
      />

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
