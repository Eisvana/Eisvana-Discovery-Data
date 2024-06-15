<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  summary: string;
}>();

const isOpen = ref(false);
</script>

<template>
  <QExpansionItem
    :class="{ 'full-width': isOpen }"
    :label="summary"
    @after-hide="isOpen = false"
    @before-show="isOpen = true"
  >
    <slot v-if="isOpen"></slot>
  </QExpansionItem>
</template>
