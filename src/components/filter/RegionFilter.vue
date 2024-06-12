<script setup lang="ts">
import { regions as eisvanaRegions } from '@/variables/regions';
import { useFilterStore } from '@/stores/filter';
import { storeToRefs } from 'pinia';

const filterStore = useFilterStore();
const { regions } = storeToRefs(filterStore);

const eisvanaRegionNames = Object.values(eisvanaRegions);
</script>

<template>
  <QCard
    bordered
    flat
  >
    <QExpansionItem label="Filter Regions">
      <QCardSection>
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
      </QCardSection>
    </QExpansionItem>
  </QCard>
</template>
