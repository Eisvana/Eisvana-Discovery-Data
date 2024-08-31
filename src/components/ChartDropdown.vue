<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  summary: string;
  group?: string;
}>();

// using different properties for them because v-model sets its values before show and before hide
const isOpen = ref(false);
</script>

<template>
  <QExpansionItem
    :group
    :label="summary"
    @after-hide="isOpen = false"
    @before-show="isOpen = true"
  >
    <div
      v-if="isOpen"
      class="q-px-md"
    >
      <slot></slot>
    </div>
  </QExpansionItem>
</template>
