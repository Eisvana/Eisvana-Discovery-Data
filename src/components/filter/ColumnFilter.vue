<script setup lang="ts">
import PlatformCheckbox from './PlatformCheckbox.vue';
import TagSelect from './TagSelect.vue';
import TextFilterInput from './TextFilterInput.vue';
import { useFilterStore } from '@/stores/filter';
import { storeToRefs } from 'pinia';
import { platformMapping } from '@/variables/mappings';
import { computed, ref, watchEffect } from 'vue';
import { useDataStore } from '@/stores/data';

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

const selectInputs = [
  {
    label: 'Correctly Prefixed',
    options: [
      {
        label: '',
        value: '',
      },
      {
        label: 'True',
        value: 'true',
      },
      {
        label: 'False',
        value: 'false',
      },
    ],
  },
];

const filterStore = useFilterStore();
const { searchTerms, intersections, caseSensitivity, date, tagged } = storeToRefs(filterStore);

const dataStore = useDataStore();
const { filteredData } = storeToRefs(dataStore);

const taggedRaw = ref<string>('');

const getTagStatus = (tagStatus: string) => (tagStatus === '' ? '' : tagStatus === 'true');
watchEffect(() => (tagged.value = getTagStatus(taggedRaw.value)));

const dataContainsSystems = computed(() => filteredData.value.some((item) => 'Correctly Prefixed' in item));
</script>

<template>
  <fieldset>
    <QExpansionItem label="Filter Data">
      <legend>Filter Data:</legend>
      <div class="data-filter">
        <TextFilterInput
          v-for="textInput in textInputs"
          v-model:searchTerm="searchTerms[textInput.id]"
          v-model:intersection="intersections[textInput.id]"
          v-model:caseSensitivity="caseSensitivity[textInput.id]"
          :id="textInput.id"
          :label="textInput.label"
        />

        <PlatformCheckbox
          v-for="platformSwitch in platformSwitches"
          :label="platformSwitch.label"
          :switches="platformSwitch.switches"
        />

        <QDate
          v-model="date"
          firstDayOfWeek="1"
          mask="YYYY-MM-DD"
          title="Date Range"
          range
          todayBtn
        />

        <TagSelect
          v-if="dataContainsSystems"
          v-for="selectInput in selectInputs"
          v-model="taggedRaw"
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
