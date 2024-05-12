<script setup lang="ts">
import PlatformCheckboxes from './PlatformCheckboxes.vue';
import DateInput from './DateInput.vue';
import TagSelect from './TagSelect.vue';
import TextFilterInput from './TextFilterInput.vue';
import { useFilterStore } from '@/stores/filter';
import { storeToRefs } from 'pinia';
import { platformMapping } from '@/variables/mappings';
import { ref, watchEffect } from 'vue';

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

const platformSwitches = [
  {
    label: 'Platforms',
    id: 'platform',
    switches: platformMapping,
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
    label: 'Correctly Prefixed',
    id: 'correctly prefixed',
    options: {
      '': '',
      true: 'True',
      false: 'False',
    },
  },
];

const filterStore = useFilterStore();
const { searchTerms, intersections, caseSensitivity, date, tagged } = storeToRefs(filterStore);

const taggedRaw = ref<string>('');

const getTagStatus = (tagStatus: string) => (tagStatus === '' ? '' : tagStatus === 'true');
watchEffect(() => (tagged.value = getTagStatus(taggedRaw.value)));
</script>

<template>
  <fieldset>
    <details>
      <summary>Filter Data</summary>
      <legend>Filter Data:</legend>
      <div class="data-filter">
        <TextFilterInput
          v-if="textInputs.length"
          v-for="textInput in textInputs"
          v-model:searchTerm="searchTerms[textInput.id]"
          v-model:intersection="intersections[textInput.id]"
          v-model:caseSensitivity="caseSensitivity[textInput.id]"
          :id="textInput.id"
          :label="textInput.label"
        />

        <PlatformCheckboxes
          v-if="platformSwitches.length"
          v-for="platformSwitch in platformSwitches"
          :id="platformSwitch.id"
          :label="platformSwitch.label"
          :switches="platformSwitch.switches"
        />

        <DateInput
          v-if="dateInputs.length"
          v-for="dateInput in dateInputs"
          v-model="date[dateInput.id]"
          :id="dateInput.id"
          :label="dateInput.label"
        />

        <TagSelect
          v-if="selectInputs.length"
          v-for="selectInput in selectInputs"
          v-model="taggedRaw"
          :id="selectInput.id"
          :label="selectInput.label"
          :options="selectInput.options"
        />
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
