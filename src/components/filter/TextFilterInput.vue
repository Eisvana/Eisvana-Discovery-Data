<script setup lang="ts">
import type { QSelectOption } from 'quasar';

defineProps<{
  label: string;
}>();

const searchTerm = defineModel<string>('searchTerm', { required: true });
const intersection = defineModel<string>('intersection', { required: true });
const caseSensitivity = defineModel<boolean>('caseSensitivity', { required: true });

const intersectionOptions: QSelectOption[] = [
  { label: 'Includes', value: 'includes' },
  { label: 'Is exactly', value: 'is' },
  { label: "Doesn't include", value: '!includes' },
  { label: 'Is not', value: '!is' },
];
</script>

<template>
  <div class="text-input-wrapper">
    <QCard
      class="text-input"
      bordered
      flat
    >
      <QInput
        v-model="searchTerm"
        :label
        outlined
      />

      <QExpansionItem label="Advanced Options">
        <QItemSection class="q-px-md q-py-sm">
          <div class="filter-adjustments">
            <QSelect
              v-model="intersection"
              :options="intersectionOptions"
              class="intersection-select"
              emit-value
              map-options
              outlined
            />
            <QToggle
              v-if="label !== 'Glyphs'"
              v-model="caseSensitivity"
              label="Case Sensitive"
            />
          </div>
        </QItemSection>
      </QExpansionItem>
    </QCard>
  </div>
</template>

<style scoped lang="scss">
.text-input-wrapper {
  flex-basis: 30%;
  flex-grow: 1;

  .text-input {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}

.filter-adjustments {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  .intersection-select {
    flex-grow: 1;
  }
}
</style>
