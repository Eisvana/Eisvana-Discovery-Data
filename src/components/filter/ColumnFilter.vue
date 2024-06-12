<script setup lang="ts">
import PlatformCheckbox from './PlatformCheckbox.vue';
import TextFilterInput from './TextFilterInput.vue';
import { useFilterStore } from '@/stores/filter';
import { storeToRefs } from 'pinia';
import { platformMapping } from '@/variables/mappings';
import { computed } from 'vue';

const textInputs = [
  {
    label: 'System Name',
    id: 'name',
  },
  {
    label: 'Glyphs',
    id: 'glyphs',
  },
  {
    label: 'Discoverer',
    id: 'discoverer',
  },
];

const platformSwitch = {
  label: 'Platforms',
  id: 'platform',
  switches: platformMapping,
};

const selectInput = {
  label: 'Correctly Prefixed',
  options: [
    {
      label: '',
      value: '',
    },
    {
      label: 'True',
      value: true,
    },
    {
      label: 'False',
      value: false,
    },
  ],
};

const filterStore = useFilterStore();
const { searchTerms, intersections, caseSensitivity, date, tagged, categories } = storeToRefs(filterStore);

const dataContainsSystems = computed(() => categories.value.includes('system'));
</script>

<template>
  <fieldset>
    <QExpansionItem label="Filter Data">
      <legend>Filter Data:</legend>
      <div class="data-filter">
        <!--Name/Discoverer/Glyphs filter-->
        <TextFilterInput
          v-for="textInput in textInputs"
          v-model:searchTerm="searchTerms[textInput.id]"
          v-model:intersection="intersections[textInput.id]"
          v-model:caseSensitivity="caseSensitivity[textInput.id]"
          :id="textInput.id"
          :label="textInput.label"
        />

        <!--Platform switches-->
        <PlatformCheckbox
          :label="platformSwitch.label"
          :switches="platformSwitch.switches"
        />

        <!--Date picker-->
        <QDate
          v-model="date"
          firstDayOfWeek="1"
          mask="YYYY-MM-DD"
          title="Date Range"
          range
          today-btn
        />

        <!--Tagging status selector-->
        <QSelect
          v-if="dataContainsSystems"
          v-model="tagged"
          :label="selectInput.label"
          :options="selectInput.options"
        />
      </div>
    </QExpansionItem>
  </fieldset>
</template>

<style scoped lang="scss">
.data-filter {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1.5rem 2rem;
}
</style>
