<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  summary: string;
}>();

// using different properties for them because v-model sets its values before show and before hide
const isOpen = ref(false);
const isFullWidth = ref(false);
</script>

<template>
  <QExpansionItem
    v-model="isFullWidth"
    :class="{ 'full-width': isFullWidth }"
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
