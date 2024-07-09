<script setup lang="ts">
import { useFilterStore } from '@/stores/filter';
import { storeToRefs } from 'pinia';
import { categoryMapping } from '@/variables/mappings';

const filterStore = useFilterStore();
const { categories } = storeToRefs(filterStore);
</script>

<template>
  <QCard bordered>
    <QExpansionItem label="Filter Categories">
      <QCardSection>
        <QBtn
          class="q-mb-sm"
          label="Invert Selection"
          outline
          no-caps
          @click="filterStore.invertCategorySwitches"
        />

        <div class="stat-grid dynamic-cols">
          <QCheckbox
            v-for="({ label }, categoryName) in categoryMapping"
            v-model="categories"
            :label
            :val="categoryName"
          />
        </div>
      </QCardSection>
    </QExpansionItem>
  </QCard>
</template>
