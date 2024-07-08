<script setup lang="ts">
import PlatformCheckbox from './PlatformCheckbox.vue';
import TextFilterInput from './TextFilterInput.vue';
import { useFilterStore } from '@/stores/filter';
import { storeToRefs } from 'pinia';
import { platformMapping } from '@/variables/mappings';
import { computed, reactive } from 'vue';
import type { QSelectOption } from 'quasar';

const filterStore = useFilterStore();
const { searchTerms, intersections, caseSensitivity, date, tagged, procName, categories } = storeToRefs(filterStore);

const dataContainsSystems = computed(() => categories.value.includes('SolarSystem'));

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

const simplePlatformMapping = Object.entries(platformMapping).map((item) => [item[0], item[1].label]);

const platformSwitch: {
  label: string;
  switches: Record<keyof typeof platformMapping, string>;
} = {
  label: 'Platforms',
  switches: Object.fromEntries(simplePlatformMapping),
};

const selectInputs: {
  label: string;
  condition?: boolean;
  model: boolean | '';
  options: QSelectOption<string | boolean>[];
}[] = reactive([
  {
    label: 'Correctly Prefixed',
    condition: dataContainsSystems,
    model: tagged,
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
  },
  {
    label: 'Procedural Name',
    model: procName,
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
  },
]);
</script>

<template>
  <QCard bordered>
    <QExpansionItem label="Filter Data">
      <QCardSection class="data-filter">
        <!--Name/Glyphs/Discoverer filter-->
        <TextFilterInput
          v-for="textInput in textInputs"
          v-model:searchTerm="searchTerms[textInput.id]"
          v-model:intersection="intersections[textInput.id]"
          v-model:caseSensitivity="caseSensitivity[textInput.id]"
          :label="textInput.label"
        />

        <!--Platform switches-->
        <div class="col-grow">
          <PlatformCheckbox
            :label="platformSwitch.label"
            :switches="platformSwitch.switches"
          />
        </div>

        <!--Date picker-->
        <div class="col-grow">
          <QDate
            v-model="date"
            firstDayOfWeek="1"
            mask="YYYY-MM-DD"
            title="Date Range"
            bordered
            flat
            range
            today-btn
          />
        </div>

        <!--Tagging/Rename status selector-->
        <div class="column col-grow q-gutter-y-xl select-min-width">
          <template v-for="select in selectInputs">
            <QSelect
              v-if="select.condition ?? true"
              v-model="select.model"
              :label="select.label"
              :options="select.options"
              emit-value
              map-options
            />
          </template>
        </div>
      </QCardSection>
    </QExpansionItem>
  </QCard>
</template>

<style scoped lang="scss">
.data-filter {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1.5rem 2rem;
}
</style>
