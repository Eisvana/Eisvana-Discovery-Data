<script setup lang="ts">
import PlatformCheckboxes from './PlatformCheckboxes.vue';
import DateInput from './DateInput.vue';
import TagSelect from './TagSelect.vue';
import TextFilterInput from './TextFilterInput.vue';
import { useFilterStore } from '@/stores/filter';
import { storeToRefs } from 'pinia';
import { reactive, watch } from 'vue';

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
      SI: 'Nintendo Switch',
    },
  },
];

const dateInputs = [
  {
    label: 'Startdate',
    id: 'startdate',
  },
  {
    label: 'Enddate',
    id: 'enddate',
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
const { name, discoverer, glyphs, platform, date, tagged } = storeToRefs(filterStore);

const searchTerms: string[] = reactive(['', '', '']);
const intersections: string[] = reactive(['', '', '']);

watch(searchTerms, (newValue: string[]) => {
  const [nameSearch, glyphSearch, discovererSearch] = newValue;
  name.value.searchTerm = nameSearch;
  glyphs.value.searchTerm = glyphSearch;
  discoverer.value.searchTerm = discovererSearch;
});

watch(intersections, (newValue: string[]) => {
  const [nameSearchIntersection, glyphSearchIntersection, discovererSearchIntersection] = newValue;
  name.value.intersection = nameSearchIntersection;
  glyphs.value.intersection = glyphSearchIntersection;
  discoverer.value.intersection = discovererSearchIntersection;
});
</script>

<template>
  <fieldset>
    <details>
      <summary>Filter Data</summary>
      <legend>Filter Data:</legend>
      <div class="data-filter">
        <div
          v-if="textInputs.length"
          v-for="(textInput, index) in textInputs"
        >
          <TextFilterInput
            v-bind="textInput"
            v-model:searchTerm="searchTerms[index]"
            v-model:intersection="intersections[index]"
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
          <DateInput v-bind="dateInput" />
        </div>

        <div
          v-if="selectInputs.length"
          v-for="selectInput in selectInputs"
        >
          <TagSelect v-bind="selectInput" />
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
