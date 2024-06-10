<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  summary: string;
}>();

const isOpen = ref(false);
</script>

<template>
  <QExpansionItem
    :label="summary"
    @before-show="isOpen = true"
    @after-hide="isOpen = false"
  >
    <slot></slot>
  </QExpansionItem>
</template>
