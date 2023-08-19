<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  summary: string;
}>();

const isOpen = ref<boolean>(false);

function changeOpenState(e: Event) {
  isOpen.value = Boolean((e.target as HTMLDetailsElement | null)?.open);
}
</script>

<template>
  <details @toggle="changeOpenState">
    <summary>{{ summary }}</summary>
    <slot v-if="isOpen"></slot>
  </details>
</template>
