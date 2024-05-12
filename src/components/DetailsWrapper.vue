<script setup lang="ts">
import { onMounted, ref } from 'vue';

defineProps<{
  summary: string;
}>();

const isOpen = ref<boolean>(false);

function changeOpenState(e: Event) {
  if (!(e.target instanceof HTMLDetailsElement)) return;
  isOpen.value = Boolean(e.target.open);
}

// temporary workaround, see https://github.com/vuejs/language-tools/issues/4373
const details = ref<HTMLDetailsElement | null>(null);
onMounted(() => details.value?.addEventListener('toggle', changeOpenState));
</script>

<template>
  <details ref="details">
    <summary>{{ summary }}</summary>
    <slot v-if="isOpen"></slot>
  </details>
</template>
