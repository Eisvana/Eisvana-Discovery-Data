<script setup lang="ts">
import PlatformCheckboxes from './PlatformCheckboxes.vue';
import DateInput from './DateInput.vue';
import TagSelect from './TagSelect.vue';
import TextFilterInput from './TextFilterInput.vue';
import { useFilterStore } from '@/stores/filter';
import { storeToRefs } from 'pinia';

const textInputs = [
  {
    label: 'Name',
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

const platformSwitches = [
  {
    label: 'Platforms',
    id: 'platform',
    switches: {
      ST: 'Steam',
      PS: 'PlayStation',
      XB: 'Xbox',
      GX: 'GOG',
      NI: 'Nintendo Switch',
    },
  },
];

const dateInputs = [
  {
    label: 'Startdate',
    id: 'startDate',
  },
  {
    label: 'Enddate',
    id: 'endDate',
  },
];

const selectInputs = [
  {
    label: 'Correctly Tagged',
    id: 'correctly tagged',
    options: {
      '': '',
      true: 'True',
      false: 'False',
    },
  },
];

const filterStore = useFilterStore();
const { searchTerms, intersections, date, tagged } = storeToRefs(filterStore);
</script>

<template>
  <fieldset>
    <details>
      <summary>Filter Data</summary>
      <legend>Filter Data:</legend>
      <div class="data-filter">
        <div
          v-if="textInputs.length"
          v-for="textInput in textInputs"
        >
          <TextFilterInput
            v-bind="textInput"
            v-model:searchTerm="searchTerms[textInput.id]"
            v-model:intersection="intersections[textInput.id]"
          />
        </div>

        <div v-if="platformSwitches.length">
          <PlatformCheckboxes
            v-for="platformSwitch in platformSwitches"
            v-bind="platformSwitch"
          />
        </div>

        <div
          v-if="dateInputs.length"
          v-for="dateInput in dateInputs"
        >
          <DateInput
            v-bind="dateInput"
            v-model="date[dateInput.id]"
          />
        </div>

        <div
          v-if="selectInputs.length"
          v-for="selectInput in selectInputs"
        >
          <TagSelect
            v-bind="selectInput"
            v-model="tagged"
          />
        </div>
      </div>
    </details>
  </fieldset>
</template>

<style scoped lang="scss">
.data-filter {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem 2rem;
}
</style>
